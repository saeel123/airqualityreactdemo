import React, { useEffect, useState } from "react";
import leaflet from "leaflet";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  getDefaultObservationStation,
  getObservationStationList,
  getStationChartData,
} from "../Services/dataFetchServices";
require("highcharts/modules/exporting")(Highcharts);

let mymap;
let tdWmsPm2Layer;
let tdWmsAODLayer;

function Auth() {
  useEffect(() => {
    map();
  }, []);

  const map = () => {
    mymap = leaflet
      .map("map", { minZoom: 5, maxZoom: 15 })
      .setView([15.87, 100.9925], 5);

    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(mymap);

    rendertdWmsAODLayer();
  };

  //layer controller
  const [showLayerController, setshowLayerController] = useState(false);

  //render WMS layer
  var wurl = "http://smog.spatialapps.net:8080/geoserver/AirQuality/wms";

  const bbboxretuen = () => {
    let t = mymap.getBounds().toBBoxString();
    return t;
  };

  const rendertdWmsAODLayer = () => {
    tdWmsAODLayer = leaflet.tileLayer.wms(wurl, {
      layers: "AirQuality:aeronet_aod",
      format: "image/png",
      transparent: true,
      styles: "",
      colorscalerange: "0,100",
      opacity: 1,
      version: "1.3.0",
      zIndex: 100,
      request: "GetMap",
      // bounds: [
      //   [0, 90],
      //   [22, 120],
      // ],
      BBOX: bbboxretuen,
      abovemaxcolor: "extend",
      belowmincolor: "extend",
    });
    tdWmsAODLayer.addTo(mymap);
  };

  const removetdWmsAODLayer = () => {
    let hasLayerd = mymap.hasLayer(tdWmsAODLayer);

    console.log(hasLayerd);
    if (hasLayerd === true) {
      mymap.removeLayer(tdWmsAODLayer);
      tdWmsAODLayer = null;
    }
  };

  const renderWmsPm2Layer = () => {
    tdWmsPm2Layer = leaflet.tileLayer.wms(wurl, {
      layers: "AirQuality:us_embassy_pm2p5",
      format: "image/png",
      transparent: true,
      styles: "",
      colorscalerange: "0,100",
      opacity: 1,
      version: "1.3.0",
      zIndex: 100,
      request: "GetMap",
      BBOX: bbboxretuen,
      abovemaxcolor: "extend",
      belowmincolor: "extend",
    });
    tdWmsPm2Layer.addTo(mymap);
  };

  const removeWmsPm2Layer = () => {
    console.log(tdWmsPm2Layer);

    let hasLayerd = mymap.hasLayer(tdWmsPm2Layer);

    console.log(hasLayerd);
    if (hasLayerd === true) {
      mymap.removeLayer(tdWmsPm2Layer);
      tdWmsPm2Layer = null;
    }
  };

  const [selectedPollutants, setSelectedPollutants] = useState("aod");

  const onPollutantsSelect = (e) => {
    let pollutant = e.target.value;
    setSelectedPollutants(e.target.value);

    console.log(pollutant);

    if (pollutant == "pm2") {
      console.log("Check PM2");
      removetdWmsAODLayer();
      renderWmsPm2Layer();
    }
    if (pollutant == "aod") {
      rendertdWmsAODLayer();

      removeWmsPm2Layer();
    }
  };

  // useEffect(() => {
  //   console.log(selectedPollutants);

  //   if (selectedPollutants == "pm2") {
  //     rendertdWmsAODLayerpm2p5Layer();
  //     removetdWmsAODLayer();
  //   } else {
  //     rendertdWmsAODLayer();
  //     removettdWmsAODLayerpm2p5Layer();
  //   }
  // }, [selectedPollutants]);

  //aside controller
  let showAsidebar = false;
  const onAsideButton = () => {
    showAsidebar = !showAsidebar;
    if (showAsidebar === true) {
      document.body.classList.add("sidebar-active");
    } else {
      document.body.classList.remove("sidebar-active");
    }
  };

  //Chart Logic
  let showChartDailouge = false;
  const onClickDisplayChartButton = () => {
    showChartDailouge = !showChartDailouge;
    if (showChartDailouge === true) {
      document.body.classList.add("modal-open");
      showChartOne();
      showChartTwo();
    } else {
      document.body.classList.remove("modal-open");
    }
  };

  const showChartOne = () => {
    Highcharts.chart("chartOne", {
      title: {
        text: "Islamabad (Last 24 hours)",
      },
      subtitle: {
        text: "Source: Airflow",
      },
      xAxis: {
        title: {
          text: "Time(UTC)",
        },
        type: "datetime",
      },
      yAxis: {
        title: {
          text: "PM<sub>2.5(kg/m<sup>3</sup>)</sub>",
        },
      },

      // Define the data to be represented
      series: [
        {
          data: chartOneData,
          name: "PM2.5",
          pointStart: Date.UTC(2022, 11, 9, 0, 15),
          pointInterval: 3600 * 1000, // one hour
          relativeXValue: true,
        },
      ],
    });
  };

  const showChartTwo = () => {
    Highcharts.chart("chartTwo", {
      title: {
        text: "Islamabad (Last 24 hours)",
      },
      subtitle: {
        text: "Source: Airflow",
      },
      xAxis: {
        title: {
          text: "Time(UTC)",
        },
        type: "datetime",
      },
      yAxis: {
        title: {
          text: "PM<sub>2.5(kg/m<sup>3</sup>)</sub>",
        },
      },

      // Define the data to be represented
      series: [
        {
          data: chartOneData,
          name: "PM2.5",
          pointStart: Date.UTC(2022, 11, 9, 0, 15),
          pointInterval: 3600 * 1000, // one hour
          relativeXValue: true,
        },
      ],
    });
  };

  const computeChartData = () => {
    getChartOneData();
    getChartTwoData();
  };

  const [chartOneData, setchartOneData] = useState([]);
  const getChartOneData = () => {
    let chartOneDataTemp = [];
    getStationChartData()
      .then((res) => {
        console.log(res);
        let SeriesData = res.SeriesData;

        SeriesData.forEach((element) => {
          chartOneDataTemp.push(element[1]);
        });
        console.log(chartOneDataTemp);
        setchartOneData(chartOneDataTemp);
      })
      .catch((err) => {
        console.log("axios err=", err);
      });

    return () => {};
  };

  const [chartTwoData, setchartTwoData] = useState([]);
  const getChartTwoData = () => {
    let chartTwoDataTemp = [];
    getStationChartData()
      .then((res) => {
        console.log(res);
        let SeriesData = res.SeriesData;

        SeriesData.forEach((element) => {
          chartTwoDataTemp.push(element[1]);
        });
        setchartTwoData(chartTwoDataTemp);
      })
      .catch((err) => {
        console.log("axios err=", err);
      });

    return () => {};
  };

  //Side Drawer logic start
  const [stationOne, setstationOne] = useState("");
  const [stationTwo, setstationTwo] = useState("");
  const [stationThree, setstationThree] = useState("");
  const [stationFour, setstationFour] = useState("");

  const setDefaultObservationStation = () => {
    let typeName = "pm";
    let startDate = "2022-12-09";
    let endDate = "2022-12-10";
    let currentTimeHrMin = "22-14";

    getDefaultObservationStation(typeName, startDate, endDate, currentTimeHrMin)
      .then((res) => {
        console.log(res.defaultStation);
        let defaultStationArray = res.defaultStation;
        setstationOne(defaultStationArray[0]);
        setstationTwo(defaultStationArray[1]);
        setstationThree(defaultStationArray[2]);
        setstationFour(defaultStationArray[3]);
      })
      .catch((err) => {
        console.log("axios err=", err);
      });

    return () => {};
  };

  const [observationStations, setObservationStations] = useState([]);
  const getObservationStationsList = () => {
    let startDate;
    let endDate;
    getObservationStationList(startDate, endDate)
      .then((res) => {
        console.log(res.data);
        setObservationStations(res.data);
      })
      .catch((err) => {
        console.log("axios err=", err);
      });

    return () => {};
  };

  useEffect(() => {
    getObservationStationsList();
    setDefaultObservationStation();
  }, []);

  return (
    <div>
      {/* <!-- Sidebar --> */}
      <aside class="controls-sidebar">
        <button class="sidebar-close">&times;</button>
        <h3>Map controls</h3>
        <form class="recent-filter filter-form">
          <div class="form-group">
            <label class="group-labels">Select Parameter</label>
            <select class="form-control mb-0">
              <option>Parameter</option>
              {/* <option>Location</option> */}
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Pollutants</label>
            <select
              value={selectedPollutants}
              onChange={onPollutantsSelect}
              class="form-control"
            >
              <option value="aod">Surface Observation-AOD (AERONET)</option>
              <option value="pm2">Ground Observation-PM2.5 (AirNow)</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Select Stations</label>
            <select value={stationOne} class="form-control">
              {observationStations.map((option, index) => (
                <option value={option.value} key={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="form-group">
            <select value={stationTwo} class="form-control">
              {observationStations.map((option, index) => (
                <option value={option.value} key={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="form-group">
            <select value={stationThree} class="form-control">
              {observationStations.map((option, index) => (
                <option value={option.value} key={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="form-group">
            <select value={stationFour} class="form-control">
              {observationStations.map((option, index) => (
                <option value={option.value} key={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="spacer-margin"></div>
          <button
            onClick={() => computeChartData()}
            type="button"
            class="btn btn-primary w-100 mb-4"
          >
            Compute
          </button>
          <button
            onClick={() => onClickDisplayChartButton()}
            type="button"
            class="btn btn-danger w-100"
            data-toggle="modal"
            data-target="#chartsModal"
          >
            Display charts
          </button>
        </form>
      </aside>
      {/* <!-- Sidebar --> */}

      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-recent"
          role="tabpanel"
          aria-labelledby="pills-recent-tab"
        >
          {/* <!-- Map --> */}
          <div class="map-wrapper">
            <div class="control-btn">
              <button
                class="surface-popup-toggle"
                data-toggle="tooltip"
                data-placement="left"
                title="SURFACE"
              >
                <img src="./images/icons/surface.png" alt="" />
              </button>
              <button
                class="btn-search"
                data-toggle="tooltip"
                data-placement="left"
                title="SEARCH"
              >
                <img src="./images/icons/search.png" alt="" />
              </button>
            </div>
            {/* <div id="map"></div> */}
            <div id="map" style={{ height: "100vh" }}></div>
          </div>
          {/* <!-- Map --> */}
        </div>
      </div>

      {/* <!-- CHARTS POPUP --> */}
      <div
        class="modal fade chartsmodal modal-right show"
        id="chartsModal"
        tabindex="-1"
        role="dialog"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Display charts</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 col-12">
                  <div id="chartOne" class="modalChart mb-5"></div>
                </div>
                <div class="col-md-6 col-12">
                  <div id="chartTwo" class="modalChart mb-5"></div>
                </div>
                <div class="col-md-6 col-12">
                  <div id="chartThree" class="modalChart"></div>
                </div>
                <div class="col-md-6 col-12">
                  <div id="chartFour" class="modalChart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- CHARTS POPUP --> */}

      {/* <!-- Surface pm visibility popup --> */}
      {/* <div class="surface-popup">
        <div class="surface-popup-header">
          Surface PM 2.5 (PGM<sup>-3</sup>)
        </div>
        <div class="surface-popup-body">
          <ul class="d-flex align-items-center justify-content-between">
            <li>
              <label class="group-title">0-25</label>
              <label class="group-status">Excellent</label>
            </li>
            <li>
              <label class="group-title">26-37</label>
              <label class="group-status">Satisfactory</label>
            </li>
            <li>
              <label class="group-title">38-50</label>
              <label class="group-status">Moderate</label>
            </li>
            <li>
              <label class="group-title">51-90</label>
              <label class="group-status">Unhealthy</label>
            </li>
            <li>
              <label class="group-title">91 and up</label>
              <label class="group-status">Very Unhealthy</label>
            </li>
          </ul>
        </div>
      </div> */}
      {/* <!-- Surface pm visibility popup --> */}

      {/* <!-- Map Footer --> */}
      <section class="map-footer">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-4 col-12">
              <div class="map-pointers">
                <ul class="d-flex align-items-center">
                  <li onClick={() => onAsideButton()}>
                    <a
                      title="MENU"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                      class="toggle-sidebar"
                    >
                      <img src="./images/icons/dots-menu.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      title="FULLSCREEN"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                    >
                      <img src="./images/icons/full-screen.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      title="COMPARE LAYERS"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                    >
                      <img src="./images/icons/layers.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      title="DRAW A RECTANGLE"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                    >
                      <img src="./images/icons/draw-rectangle.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      title="DRAW A MARKER"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                    >
                      <img src="./images/icons/pin-mark.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      title="DISCLAIMER"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                    >
                      <img src="./images/icons/disclaimer.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      title="RESET"
                      data-toggle="tooltip"
                      data-placement="top"
                      href="#"
                    >
                      <img src="./images/icons/reset.png" alt="" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-4 col-12 bl-1">
              <div class="date-display-block d-flex align-items-center justify-content-between">
                <div class="date-block">
                  <label class="date-label">Previous day</label>
                  <div class="date">17 September 2022</div>
                </div>
                <div class="date-block">
                  <label class="date-label">Next day</label>
                  <div class="date">17 September 2022</div>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-12 blue-bg-extend">
              <div class="map-actions">
                <ul class="d-flex">
                  <li
                    onClick={() => setshowLayerController(!showLayerController)}
                  >
                    <a href="#" class="active toggle-layer-popup">
                      <img src="./images/icons/layers.png" alt="" />
                      <label class="btn-label">Layers</label>
                    </a>
                  </li>
                  <li onClick={() => removetdWmsAODLayer()}>
                    <a href="#">
                      <img src="./images/icons/download.png" alt="" />
                      <label class="btn-label">Download</label>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="./images/icons/print.png" alt="" />
                      <label class="btn-label">Print</label>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="./images/icons/Legend.png" alt="" />
                      <label class="btn-label">Legend</label>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="./images/icons/information.png" alt="" />
                      <label class="btn-label">Information</label>
                    </a>
                  </li>
                </ul>

                {showLayerController === true ? (
                  <>
                    <div class="layer-popup">
                      <label class="block-title">Toggle layer visibility</label>
                      <div class="row no-gutters">
                        <div class="col-6">
                          <label class="check-label">PM 2.5(GEOS-ML)</label>
                          <label htmlFor="check1" class="custom-check">
                            <input type="checkbox" name="" id="check1" />
                            <span></span>
                          </label>
                        </div>
                        <div class="col-6">
                          <label class="check-label">PM 2.5 (PCD)</label>
                          <label htmlFor="check2" class="custom-check">
                            <input type="checkbox" name="" id="check2" />
                            <span></span>
                          </label>
                        </div>
                      </div>
                      <label class="block-title">Base map</label>
                      <div class="row no-gutters">
                        <div class="col-4">
                          <label class="check-label">Light</label>
                          <label htmlFor="check3" class="custom-check">
                            <input type="checkbox" name="" id="check3" />
                            <span></span>
                          </label>
                        </div>
                        <div class="col-4">
                          <label class="check-label">Dark</label>
                          <label htmlFor="check4" class="custom-check">
                            <input type="checkbox" name="" id="check4" />
                            <span></span>
                          </label>
                        </div>
                        <div class="col-4">
                          <label class="check-label">Satellite</label>
                          <label htmlFor="check5" class="custom-check">
                            <input type="checkbox" name="" id="check5" />
                            <span></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Map Footer --> */}
    </div>
  );
}

export default Auth;
