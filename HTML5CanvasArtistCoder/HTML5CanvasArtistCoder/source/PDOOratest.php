<?php
$conn = new PDO("odbc:oratest", "SYSTEM", "XeLePhAnT232@#@");
$result = $conn->prepare("select * from all_objects;");
$result->execute();

$color = "#D5D8DC";
echo "<html><body>";
do
{
    echo "<table border=\"0\">";
    $row = $result->fetchAll(PDO::FETCH_ASSOC);
    if($row && count($row) > 0) {
        $keys = array_keys($row[0]);
        echo "<tr bgcolor=\"#2C3E50\" style=\"color:#FFFFFF;\">";
        for($j = 0; $j < count($keys); $j++) {
            echo "<td align=\"center\" style=\"padding:2px, 10px;\">" . $keys[$j] . "</td>";
        }
        echo "</tr>";
        for($i = 0; $i < count($row); $i++) {
            if($color == "#D5D8DC") {
                $color = "#F8F9F9";
            } else {
                $color = "#D5D8DC";
            }
            echo "<tr bgcolor=\"$color\">";
            for($j = 0; $j < count($keys); $j++) {
                echo "<td style=\"padding:2px, 10px;\">" . $row[$i][$keys[$j]] . "</td>";
            }
            echo "</tr>";
        }
    }
    echo "</table>";
} while($result->nextRowset());
echo "</body></html>";
?>
