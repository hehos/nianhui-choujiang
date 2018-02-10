<?php

function getUrl($id, $file){
    return "{$id}/{$file}";
}

function isAutosite(){
    global $id;
    return preg_match('/^autosite/', $id);
}

$id = $_REQUEST['id'];
if(!preg_match('/^[\/a-zA-Z-_0-9]+$/', $id)){
    exit("Invalid id");
}

$charset = isAutosite() ? "gbk" : "utf-8";
header('Content-Type:text/html;charset=' . (isAutosite($charset)));

$path = __DIR__ . '/' . $id;
function getFiles($pattern, $isParent = false, $recursion = false){
    global $path;
    $realPath = $isParent ? dirname($path) : $path;

    if($recursion){
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($realPath));
    } else {
        $it = new FilesystemIterator($realPath);
    }

    return new RegexIterator($it, $pattern);
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="<?=$charset?>">
    <title>Widget</title>

    <?php if(isAutosite()){ ?>
        <link rel="stylesheet" href="http://asite.9z.cn/template/global.css">
        <style>
            .nav{ display: block; clear: both; text-align: left; }
            .nav li{ line-height: 26px; border-top:1px solid #eee; }
        </style>
    <?php } else { ?>
        <link rel="stylesheet" href="vendors/bootstrap-3.3.7-dist/css/bootstrap.css">
        <link rel="stylesheet" href="scss/comm.css">

        <?php
        foreach (getFiles('/\.css$/', true) as $fileInfo) {
            $file = str_replace(__DIR__, '', $fileInfo);
            $publicFiles[] = $file;
            echo '<link rel="stylesheet" href="' . $file . '">' . "\n";
        }
        ?>

        <style>
            .container{ max-width: 960px; width: inherit; }
            textarea{  border: 1px solid #efefef;  }
        </style>
    <?php } ?>

    <?php
    foreach (getFiles('/\.(css)$/') as $fileInfo) {
        $file = $fileInfo->getFilename();
        $url = getUrl($id, $file);
        echo '<link rel="stylesheet" href="' . $url . '" type="text/css" />' . "\n";
        echo "\n";
    }
    ?>

    <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>

</head>
<body>

<div class="container">
    <?php
    $file = $path . "/" . basename($id) . ".html";
    $content = file_get_contents($file);
    $content = preg_replace_callback('/\s+src="(.+?)"/is', function($c) use ($id){
        if(preg_match('/^(http|\/|data:)/', $c[1])){
            return $c[0];
        }
        return ' src="' . $id . "/" . $c[1] . '"';
    }, $content);
    echo $content;
    ?>
</div>

<div class="container" style="margin-top: 20px;">
    <ul class="nav nav-tabs">
        <?php
        foreach (getFiles( '/\.(css|scss|sass|js|html|php|tpl)$/', false, true) as $fileInfo) {
            $file = substr($fileInfo, strpos($fileInfo, $id) + strlen($id) + 1);
            if(!isset($defFile)){
                $defFile = isset($_REQUEST['file']) ? $_REQUEST['file'] : $file ;
            }
            $url = "?id={$id}&file={$file}";
            $class = $file ==  $defFile ? ' class="active"' : '';
            echo '<li role="presentation"' . $class . '><a href="' . $url . '">' . $file  . '</a></li>'  . "\n";
        }

        foreach (getFiles('/js|css$/', true) as $fileInfo) {
            $file = str_replace(__DIR__, '', $fileInfo);
            $url = "?id={$id}&file=../" .  basename($file);
            echo '<li role="presentation"><a href="' . $url . '">' . $file  . '</a></li>'  . "\n";
        }
        ?>
    </ul>

    <textarea style="width: 99%; margin-top:20px" rows="15"><?php
        if(isset($defFile) && $defFile && !is_numeric(strpos($defFile, '../../'))){
            echo $content = file_get_contents($path . "/" . $defFile);
        }
        ?>
    </textarea>
</div>

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="vendors/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>

<!--[if IE 8]>
<script src="http://ui.jc001.cn/bootstrap/js/html5shiv.min.js"></script>
<script src="http://ui.jc001.cn/bootstrap/js/respond.min.js"></script>
<![endif]-->

<?php

foreach (getFiles('/\.js$/', true) as $fileInfo) {
    $file = str_replace(__DIR__, '', $fileInfo);
    echo '<script type="text/javascript" src="' . $file . '"></script>';
}

foreach (getFiles('/\.js$/') as $fileInfo) {
    $file = $fileInfo->getFilename();
    $url = getUrl($id, $file);
    echo '<script type="text/javascript" src="' . $url . '"></script>';
    echo "\n";
}

?>

</body>
</html>
