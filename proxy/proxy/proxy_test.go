package proxy

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/assert/v2"
)

// 长期有效Token: 2025年4月过期
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZW50X2lkcyI6WyIxIiwiMiIsIjMiXSwibGV2ZWwiOjEsInVpZCI6NCwiZXhwaXJlIjoiMjAyMS0wMi0yOCIsImV4cCI6MTc0NTQ2OTI5OCwiaXNzIjoidGVzdCJ9.3YSb_3MBNdgZ8yv9RItklZILMB3BasWTe2cJdVvZkw8
var testTokenString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZW50X2lkcyI6WyIxIiwiMiIsIjMiXSwibGV2ZWwiOjEsInVpZCI6NCwiZXhwaXJlIjoiMjAyMS0wMi0yOCIsImV4cCI6MTc0NTQ2OTI5OCwiaXNzIjoidGVzdCJ9.3YSb_3MBNdgZ8yv9RItklZILMB3BasWTe2cJdVvZkw8"
var testTokenStringErr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZW50X2lkcyI6WyIxIiwiMiIsPjMiXSwibGV2ZWwiOjEsInVpZCI6NCwiZXhwaXJlIjoiMjAyMS0wMi0yOCIsImV4cCI6MTc0NTQ2OTI5OCwiaXNzIjoidGVzdCJ9.3YSb_3MBNdgZ8yv9RItklZILMB3BasWTe2cJdVvZkw8"

func TestJWT(t *testing.T) {

	claims := Claims{
		ContentIDs: []string{"1", "2", "3"},
		Level:      1,
		UID:        4,
		Expire:     "2021-02-28",
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Unix() + 131400000,
			Issuer:    "test",
		},
	}

	// Create
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte("hello-im-secret"))
	fmt.Printf("Test JWT %#v \n", tokenString)

	//  Parse
	tokenParse, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("hello-im-secret"), nil
	})

	if claimsParse, ok := tokenParse.Claims.(*Claims); ok && tokenParse.Valid {
		fmt.Printf("%s %d, %d, %s, %v\n",
			claimsParse.ContentIDs,
			claimsParse.Level,
			claimsParse.UID,
			claimsParse.Expire,
			claimsParse.StandardClaims.ExpiresAt,
		)
	} else {
		fmt.Println("ERROR: ", err)
	}
}

func TestGetClaims(t *testing.T) {
	router, _, _ := Setup(TestingRouters)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/vip3", nil)
	req.Header.Add("Authorization", "Bearer "+testTokenString)
	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)

	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/vip3", nil)
	req.Header.Add("Authorization", "Bearer "+testTokenStringErr)
	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
}
