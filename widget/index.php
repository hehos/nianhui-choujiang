<?php
header('Content-Type:text/html;charset=utf-8');

$id = isset($_REQUEST['id']) && $_REQUEST['id']
    ? $_REQUEST['id'] :
    '';
$type = isset($_REQUEST['type']) && $_REQUEST['type']
    ? $_REQUEST['type']
    : 'blocks';
function url($id = null){
    global $type;
    return '?type=' . $type . '&id=' . $id;
}

$types = [
    'blocks' => 'Widget',
    'apps' => 'App',
    'mobile' => 'Mobile',
    'autosite' => 'Autosite',
    'project' => 'Project',
    ];
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Widget</title>
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" href="vendors/bootstrap-3.3.7-dist/css/bootstrap.css">

    <!--  组件库系统的样式  -->
    <link rel="stylesheet" href="css/docs.css">

    <!--[if IE 8]>
    <script src="http://ui.jc001.cn/bootstrap/js/html5shiv.min.js"></script>
    <script src="http://ui.jc001.cn/bootstrap/js/respond.min.js"></script>
    <![endif]-->
</head>
<body style="padding-top: 70px;">
<nav class="navbar navbar-fixed-top navbar-inverse">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="?">9Z's widget</a>
        </div>

        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <?php foreach($types as $key => $item){
                    $class = $key ==  $type ? ' class="active"' : '';
                    ?>
                <li<?=$class?>><a href="?type=<?=$key?>"><?=$item?></a></li>
                <?php } ?>
            </ul>
        </div>
    </div>
</nav>

<div class="container" style="margin-bottom: 50px;">
    <div class="row row-offcanvas row-offcanvas-right">
        <div class="col-xs-12 col-sm-9 docs-main">
            <?php
            if($id){
                echo '<div class="page-header"><h1>' . $_REQUEST['id'] . '</h1></div>' . "\n";
                echo '<iframe src="widget.php?id=' . $_REQUEST['id'] . '"
                width="100%" marginwidth="0" onload="iframeAuto(this)"
                marginheight="0" frameborder="0" scrolling="no" height="620"></iframe>';
            } else { ?>
                <div class="jumbotron">
                    <h1>Hello, 9z widget!</h1>
                    <p>在<a href="http://v3.bootcss.com/components/" target="_blank">Bootstrap</a>基础组件的基础上构造常用web组件， 前端典型应用的Template, 用于快速高效的实现前端代码</p>
                    <p><a class="btn btn-primary btn-lg" href="?type=blocks&id=blocks/list/list-base" role="button">Example</a></p>
                </div>

                <div class="row marketing">
                    <div class="col-lg-6">
                        <h4>兼容</h4>
                        <p>兼容所有bootstrap代码，兼容ie8+, firefox, chrome</p>

                        <h4>全面</h4>
                        <p>提供现成html、js、css、php、smarty代码</p>

                        <h4>快捷</h4>
                        <p>提供打包工具，快速整合各组件代码</p>
                    </div>

                    <div class="col-lg-6">
                        <h4>Widget</h4>
                        <p>提供bootstrap所没有的常用基础组件，比如整合其实网站优秀的区域块、其它优秀框架的组件</p>

                        <h4>App</h4>
                        <p>提供常见的典型应用场景，如登录、注册、购物流程、常见详细页布局、列表页布局，可以看作是网页模板</p>

                        <h4>Mobile</h4>
                        <p>移动端的常用组件</p>

                        <h4>Autosite</h4>
                        <p>自助建站的常用组件</p>

                        <h4>Project</h4>
                        <p>具体项目组件</p>
                    </div>
                </div>

            <?php }  ?>
        </div>
        <div class="col-xs-6 col-sm-3 sidebar-offcanvas docs-sidebar">
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                <?php
                $i = 0;
                $dir = new DirectoryIterator(__DIR__ . "/" . $type);
                foreach ($dir as $fileInfo) {
                    if($fileInfo->isDot() || !$fileInfo->isDir()) {
                        continue;
                    }
                    $dirName = $fileInfo->getFilename();
                    $class = $id && preg_match("#^{$type}/{$dirName}#i", $id) ? ' in' : '';
                ?>
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="heading<?=++$i?>">
                        <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse<?=$i?>" aria-expanded="true" aria-controls="collapseOne">
                                <?=$dirName?>
                            </a>
                        </h4>
                    </div>
                    <div id="collapse<?=$i?>" class="panel-collapse collapse<?=$class?>" role="tabpanel" aria-labelledby="heading<?=$i?>">
                        <div class="panel-body">
                            <div class="list-group">
                                <?php
                                $subDir = __DIR__ . "/" . $type . "/" . $dirName ;
                                if(file_exists($subDir)){
                                    $subDir = new DirectoryIterator($subDir);
                                    $subFiles = [];
                                    foreach($subDir as $subFile) {
                                        if($subFile->isDot() || !$subFile->isDir()) {
                                            continue;
                                        }
                                        $subFiles[] = $subFile . "";
                                    }

                                    rsort($subFiles);
                                    foreach($subFiles as $subFile){
                                        $link = $type . "/" .  $dirName . "/" . $subFile;
                                        echo '<a href="' . url($link) . '" class="list-group-item">' . $subFile  . '</a>';
                                    }
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>
    </div>

    <hr />
    <footer>
        <p>&copy; 成都九正科技 2015 - <?=date("Y")?>, Local file path( Labs/myapp/widget ) </p>
    </footer>
</div>


<script>
var iframeAuto = function(iframe){
    if (document.getElementById){
        if (iframe && !window.opera){
            if (iframe.contentDocument && iframe.contentDocument.body.offsetHeight){
                var x = iframe.contentDocument.body.offsetHeight;
                iframe.height = x;
            }else if(iframe.Document && iframe.Document.body.scrollHeight){
                iframe.height = iframe.Document.body.scrollHeight;
            }
        }
    }
}
</script>

<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="vendors/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>

<!-- 右边导航悬停 docs-main -->
<script>
    (function() {
        window.onload = function() {
            var ofsetTop = $(".docs-sidebar").offset().top;
            var ofsetLeft = $(".docs-sidebar").offset().left;
            var ht = $(window).height() - ofsetTop - 30;
            var wh = $(".docs-sidebar").width() + 29;
            $(window).scroll(function() {
                // 首先判断内容区的高度是否小于右边菜单的高度。如果小于，强制拉高。
                var mainHeight = $(".docs-main").height();
                var sideHeight = $(".docs-sidebar").height();
                if(mainHeight < sideHeight) {
                    $(".docs-main").height(sideHeight + 20);
                }
                if($(window).scrollTop() > 20) {
                    $(".docs-sidebar").css({
                        "position": "fixed",
                        "left": ofsetLeft,
                        "top": ofsetTop,
                        "height": ht,
                        "width": wh,
                        "overflow": "auto"
                    });
                } else {
                    $(".docs-sidebar").css({
                        "position": "relative",
                        "left": 0,
                        "top": 0,
                        "height": "auto"
                    });
                }
            });
        }
    })();
</script>

</body>
</html>
