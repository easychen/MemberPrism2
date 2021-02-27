<?php
/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks
{
    // define public methods as commands
    public function up( $note = 'update' )
    {
        $repo = "https://gitlab.com/easychen/memberprism2.git";
        $this->_exec("git add . && git commit -m '$note' && git push");
        $tmp_dir = '/tmp/MPT'.md5($repo);
        if( file_exists( $tmp_dir ) )
        {
            $this->_exec("cd $tmp_dir && git pull");
        }
        else
        {
            $this->_exec("git clone $repo $tmp_dir");
        }
        $this->_exec("cd $tmp_dir && cp -rf ./* /Users/Easy/Code/gitcode/MemberPrism2/ && cp -rf ./.vscode /Users/Easy/Code/gitcode/MemberPrism2/ && cp -rf ./.vscode /Users/Easy/Code/gitcode/MemberPrism2/ && cd  /Users/Easy/Code/gitcode/MemberPrism2/ && git add . && git commit -m '$note' && git push");

    }
}