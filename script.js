var map = L.map("map", { preferCanvas: true }).setView([48.2082, 16.3738], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

const data = fetch("./BAUMKATOGD.json").then((response) => {
  return response.json();
});

data.then(console.log("finished"));

let markers = L.markerClusterGroup();
let table = document.getElementById("table_body");

function submitData() {
  let filtered = data.then((trees) => filterData(trees));

  markers.clearLayers(markers);
  addTrees(filtered);

  table.innerHTML = "";
  fillTable2(filtered);
}

function filterData(trees) {
  let temp_trees = trees.features;
  let tree_number = document.getElementById("baumnummer").value.trim();
  let tree_type = document.getElementById("baumart").value.trim();
  let district = document.getElementById("bezirk").value.trim();

  if (tree_number !== "") {
    temp_trees = temp_trees.filter(
      (el) => el.properties.BAUMNUMMER == tree_number
    );
  }
  if (tree_type !== "") {
    temp_trees = temp_trees.filter((el) =>
      el.properties.GATTUNG_ART.includes(tree_type)
    );
  }
  if (district !== "") {
    temp_trees = temp_trees.filter((el) =>
      el.properties.BEZIRK == district
    );
  }

  return temp_trees;
}

const addTrees = (filtered) =>
  filtered
    .then((trees) =>
      trees.forEach((tree) => {
        var marker = L.marker(
          new L.LatLng(
            tree.geometry.coordinates[1],
            tree.geometry.coordinates[0]
          )
        );
        markers.addLayer(marker);
      })
    )
    .then(map.addLayer(markers));

const fillTable2 = (filtered) =>
  filtered.then((trees) =>
    trees.forEach((tree) => {
      let row = table.insertRow(0);
      row.insertCell(0).innerHTML = tree.properties.BAUMNUMMER;
      row.insertCell(1).innerHTML = tree.properties.GATTUNG_ART;
      row.insertCell(2).innerHTML = tree.properties.PFLANZJAHR;
      if (
        isNaN(tree.properties.OBJEKT_STRASSE[0]) && (tree.properties.BEZIRK != null)
      ) {
        row.insertCell(3).innerHTML =
          tree.properties.BEZIRK.toString().padStart(2, "0") +
          "., " +
          tree.properties.OBJEKT_STRASSE;
      } else {
        row.insertCell(3).innerHTML = tree.properties.OBJEKT_STRASSE;
      }
    })
  );

function fillTable(filtered) {
  let table = document.getElementById("table_body");
  let row = table.insertRow(0);
  row.insertCell(0).innerHTML = filtered.properties.BAUMNUMMER;
  row.insertCell(0).innerHTML = "testcell2";
  row.insertCell(0).innerHTML = "testcell";
  row.insertCell(0).innerHTML = "testcell";
}

function drawDiagrams(tree) {}

//data.then((trees) => console.log(trees.features));
data.then((trees) =>
  console.log(trees.features.filter((el) => el.properties.BAUMNUMMER == "1"))
);
//addTrees();
//map.addLayer(markers);

/*const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});*/
