$(function () {
  if ($(window).width() > 1023) {
    $("body").addClass("sidebar-active");
  }
  $(".toggle-sidebar").on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-active");
  });
  $(".sidebar-close").on("click", function (e) {
    e.preventDefault();
    $("body").removeClass("sidebar-active");
  });

  $(".toggle-layer-popup").on("click", function () {
    $(".layer-popup").toggle();
  });
  $(".surface-popup-toggle").click(function () {
    $(".surface-popup").toggle();
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('input:radio[name="station-select"]').change(function () {
    if (this.checked) {
      $(this)
        .closest("form")
        .find(".radio-group select")
        .attr("disabled", "disabled");
      $(this).closest(".radio-group").find("select").removeAttr("disabled");
    }
  });

  // cascade menu
  var languages = [
    {
      indexcode: "1",
      name: "PM",
      s: [
        {
          indexcode: "11",
          name: "Model-PM2.5 (GEOS)",
        },
        {
          indexcode: "12",
          name: "Model-PM2.5 (GEOS)",
        },
        {
          indexcode: "13",
          name: "Model-PM2.5 (GEOS)",
        },
      ],
    },
    {
      indexcode: "2",
      name: "O3",
      s: [
        {
          indexcode: "21",
          name: "Model-PM2.5 (GEOS)",
        },
        {
          indexcode: "22",
          name: "Model-PM2.5 (GEOS)",
        },
        {
          indexcode: "23",
          name: "Model-PM2.5 (GEOS)",
        },
      ],
    },
  ];

  languages.forEach(function (item) {
    item.label = item.name;
    item.value = item.indexcode;
    item.children = item.s;
    item.s.forEach(function (item2) {
      item2.label = item2.name;
      item2.value = item2.indexcode;
    });
  });

  $("#cascade-menu").zdCascader({
    data: languages,
    container: "#cascade-menu",
  });

  // cascade menu end

  $("#chartsModal").on("shown.bs.modal", function (e) {
    // Chart one
    Highcharts.chart("chartOne", {
      title: {
        text: "Islamabad (Last 24 hours)",
      },

      subtitle: {
        text: "Source: Airflow",
      },

      yAxis: {
        title: {
          text: "PM<sub>2.5(kg/m<sup>3</sup>)</sub>",
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: "Time(UTC)",
        },
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          name: "Installation & Developers",
          data: [10, 20, 35, 22, 56, 48, 30, 44, 18, 27, 39],
        },
      ],
    });
    // Chart two
    Highcharts.chart("chartTwo", {
      title: {
        text: "Islamabad (Last 24 hours)",
      },

      subtitle: {
        text: "Source: Airflow",
      },

      yAxis: {
        title: {
          text: "PM<sub>2.5(kg/m<sup>3</sup>)</sub>",
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: "Time(UTC)",
        },
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          name: "Installation & Developers",
          data: [10, 20, 35, 22, 56, 48, 30, 44, 18, 27, 39],
        },
      ],
    });
    // Chart three
    Highcharts.chart("chartThree", {
      title: {
        text: "Islamabad (Last 24 hours)",
      },

      subtitle: {
        text: "Source: Airflow",
      },

      yAxis: {
        title: {
          text: "PM<sub>2.5(kg/m<sup>3</sup>)</sub>",
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: "Time(UTC)",
        },
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          name: "Installation & Developers",
          data: [10, 20, 35, 22, 56, 48, 30, 44, 18, 27, 39],
        },
      ],
    });
    // Chart four
    Highcharts.chart("chartFour", {
      title: {
        text: "Islamabad (Last 24 hours)",
      },

      subtitle: {
        text: "Source: Airflow",
      },

      yAxis: {
        title: {
          text: "PM<sub>2.5(kg/m<sup>3</sup>)</sub>",
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: "Time(UTC)",
        },
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          name: "Installation & Developers",
          data: [10, 20, 35, 22, 56, 48, 30, 44, 18, 27, 39],
        },
      ],
    });
  });

  generateMap("map");

  $('a[data-toggle="pill"]').on("shown.bs.tab", function (e) {
    var type = e.target.hash.substr(1);
    switch (type) {
      case "pills-recent":
        $(".filter-form").hide();
        $(".recent-filter").show();
        break;
      case "pills-archive":
        $(".filter-form").hide();
        $(".archive-filter").show();
        generateMap("mapone");
        break;
      case "pills-forecast":
        $(".filter-form").hide();
        $(".forecast-filter").show();
        generateMap("maptwo");
        break;
      case "pills-emission":
        $(".filter-form").hide();
        $(".emission-filter").show();
        generateMap("mapthree");
        break;
      default:
        break;
      // code block
    }
  });
});

function generateMap(mapId) {
  return;
  var map = L.map("" + mapId + "", {
    center: [51.505, -0.09],
    zoom: 5,
    zoomControl: false,
  });
  L.control
    .zoom({
      position: "topright",
    })
    .addTo(map);
  L.tileLayer(
    "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=0uLu36LXLIpQ3Rd7o9FV",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map);
}
