<?php
/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks
{
    // define public methods as commands
    public function build()
    {
        $this->_exec("GOOS=linux GOARCH=amd64 go build -o server-linux server.go ");
        $this->_exec("GOOS=darwin GOARCH=amd64  go build -o server-mac server.go");
        $this->_exec("cp -f server-linux /Users/Easy/Playground/prism2/proxy/server-linux");
    }
}