<?php

$color = "#D5D8DC";

// Connects to the XE service (i.e. database) on the "localhost" machine
$conn = oci_connect('SYSTEM', 'XeLePhAnT232@#@', 'rampage/XE');
if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}

$stid = oci_parse($conn, 'SELECT * FROM all_users');
oci_execute($stid);

echo "<table border=\"0\">\n";
$do_once = FALSE;
while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
    if(!$do_once) {
        $do_once = TRUE;
        echo "<tr bgcolor=\"#2C3E50\" style=\"color:#FFFFFF;\">\n";
        foreach ($row as $key => $value) {
            echo "    <td>" . ($key !== null ? htmlentities($key, ENT_QUOTES) : "&nbsp;") . "</td>\n";
        }
        echo "</tr>\n";
    }
    if($color == "#D5D8DC") {
        $color = "#F8F9F9";
    } else {
        $color = "#D5D8DC";
    }
    echo "<tr bgcolor=\"$color\">\n";
    foreach ($row as $key => $value) {
        echo "    <td>" . ($value !== null ? htmlentities($value, ENT_QUOTES) : "&nbsp;") . "</td>\n";
    }
    echo "</tr>\n";
}
echo "</table>\n";

?>