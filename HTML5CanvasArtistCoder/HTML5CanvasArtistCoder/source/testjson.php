<?php
    $a = json_decode(htmlspecialchars_decode($_POST['data']));
    $a->age = 46;
    echo json_encode($a);
?>
