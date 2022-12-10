import React, { useEffect, useState } from "react";
import leaflet from "leaflet";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
let mymap;

function Auth() {
  console.log("reloaded");
  useEffect(() => {
    console.log("render");
    map();
  }, []);

  const map = () => {
    mymap = leaflet.map("map").setView([15.87, 100.9925], 5);

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

  //aside controller
  let showAsidebar = false;
  const onAsideButton = () => {
    showAsidebar = !showAsidebar;
    if (showAsidebar === true) {
      document.body.classList.add("sidebar-active");
      // document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("sidebar-active");
      // document.body.classList.remove("");
    }
  };

  //Chart Logic
  let showChartDailouge = false;
  const onClickDisplayChartButton = () => {
    showChartDailouge = !showChartDailouge;
    if (showChartDailouge === true) {
      document.body.classList.add("modal-open");
      showChartOne();
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
          data: [
            40.0, 47.0, 65.0, 76.0, 85.0, 53.0, 39.0, 36.0, 18.0, 25.0, 147.0,
            27.0, 28.0, 34.0, 42.0, 59.0, 71.0, 50.0, 65.0, 60.0, 49.0, 49.0,
            48.0, 41.0, 43.0, 59.0, 69.0, 79.0, 84.0, 84.0, 46.0, 44.0, 26.0,
            16.0, 17.0, 24.0, 29.0,
          ],
          name: "PM2.5",
          pointStart: Date.UTC(2022, 11, 9, 0, 15),
          pointInterval: 3600 * 1000, // one hour
          relativeXValue: true,
        },
      ],
    });
  };

  //render WMS layer
  var wurl = "http://smog.spatialapps.net:8080/geoserver/AirQuality/wms";

  const bbboxretuen = () => {
    let t = mymap.getBounds().toBBoxString();
    return t;
  };

  var tdWmsAODLayer;
  const rendertdWmsAODLayer = () => {
    console.log(bbboxretuen);

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
    console.log(mymap);
    console.log("REMOVE PM@");
    let hasLayerd = mymap.hasLayer(tdWmsAODLayer);

    console.log(hasLayerd);
    if (hasLayerd === true) {
      mymap.removeLayer(tdWmsAODLayer);
      tdWmsAODLayer = null;
    }
  };

  var tdWmsAODLayerpm2p5;
  const rendertdWmsAODLayerpm2p5Layer = () => {
    tdWmsAODLayerpm2p5 = leaflet.tileLayer.wms(wurl, {
      layers: "AirQuality:us_embassy_pm2p5",
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
    tdWmsAODLayerpm2p5.addTo(mymap);
  };

  const removettdWmsAODLayerpm2p5Layer = () => {
    mymap.removeLayer(tdWmsAODLayerpm2p5);
    tdWmsAODLayerpm2p5 = null;
  };

  const [selectedPollutants, setSelectedPollutants] = useState("aod");

  const onPollutantsSelect = (e) => {
    let pollutant = e.target.value;
    setSelectedPollutants(e.target.value);

    console.log(pollutant);

    if (pollutant == "pm2") {
      removetdWmsAODLayer();
      rendertdWmsAODLayerpm2p5Layer();
    }
    if (pollutant == "aod") {
      removettdWmsAODLayerpm2p5Layer();
      rendertdWmsAODLayer();
      // rendertdWmsAODLayer();
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
              <option>Location</option>
              <option>Parameter</option>
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
            <select class="form-control">
              <option>Rangoon</option>
              <option>Embassy Kathmandu</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
              <option>Rangoon</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control">
              <option>New Delhi</option>
              <option>Embassy Kathmandu</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control">
              <option>Kolkata</option>
              <option>Dhaka</option>
              <option>Embassy Kathmandu</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control">
              <option>Islamabad</option>
              <option>Embassy Kathmandu</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <button type="button" class="btn btn-primary w-100 mb-4">
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
        <form class="archive-filter filter-form">
          <div class="form-group">
            <label class="group-labels">Select By</label>
            <select class="form-control mb-0">
              <option>Parameter</option>
              <option>Location</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Pollutants</label>
            <select class="form-control mb-3">
              <option>PM / Ground Observation-PM2.5 (AirNow)</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Select Stations</label>
            <select class="form-control">
              <option>Rangoon</option>
              <option>Embassy Kathmandu</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control">
              <option>Embassy Kathmandu</option>
              <option>Dhaka</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control">
              <option>Phora Durbar Kathmandu</option>
              <option>Dhaka</option>
              <option>Embassy Kathmandu</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control">
              <option>Dhaka</option>
              <option>Embassy Kathmandu</option>
              <option>Islamabad</option>
              <option>Kabul</option>
              <option>Kolkata</option>
              <option>Lahore</option>
              <option>New Delhi</option>
              <option>Phora Durbar Kathmandu</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <button type="submit" class="btn btn-primary w-100 mb-4">
            Compute
          </button>
          <button type="submit" class="btn btn-danger w-100">
            Display charts
          </button>
        </form>
        <form class="emission-filter filter-form">
          <div class="form-group">
            <label class="group-labels">Inventory</label>
            <select class="form-control mb-0">
              <option>REAS</option>
              <option>GAINS</option>
              <option>EDGAR</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Pollutants</label>
            <select class="form-control mb-3">
              <option>PM25</option>
              <option>BC</option>
              <option>CO</option>
              <option>NOx</option>
              <option>OC</option>
              <option>PM10</option>
              <option>PM25</option>
              <option>SO2</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Sectors</label>
            <select class="form-control">
              <option>Total</option>
              <option>Residential</option>
              <option>Industry</option>
              <option>Transport</option>
              <option>Energy</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Year</label>
            <select class="form-control">
              <option>2015</option>
              <option>1990</option>
              <option>1995</option>
              <option>2000</option>
              <option>2005</option>
              <option>2010</option>
              <option>2015</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <button type="submit" class="btn btn-danger w-100 mt-4">
            Display charts
          </button>
        </form>
        <form class="forecast-filter filter-form">
          <div class="form-group">
            <label class="group-labels">Select Parameter</label>
            <select class="form-control mb-0">
              <option>Parameter</option>
              <option>Location</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Pollutants</label>
            <select class="form-control mb-3">
              <option>PM / Model-PM2.5 (WRF-Chem)</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div class="spacer-margin"></div>
          <div class="form-group">
            <label class="group-labels">Select Stations</label>
          </div>
          <div class="radio-group d-flex align-items-center">
            <div class="radio-group-prepend d-flex align-items-center">
              <input type="radio" name="station-select" checked />
              <select class="form-control">
                <option selected>Major Cities</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="radio-group-append">
              <select class="form-control">
                <option selected>Kathmandu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div class="radio-group d-flex align-items-center">
            <div class="radio-group-prepend d-flex align-items-center">
              <input type="radio" name="station-select" />
              <select class="form-control" disabled>
                <option selected>Major Cities</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="radio-group-append">
              <select class="form-control" disabled>
                <option selected>Kathmandu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div class="radio-group d-flex align-items-center">
            <div class="radio-group-prepend d-flex align-items-center">
              <input type="radio" name="station-select" />
              <select class="form-control" disabled>
                <option selected>Major Cities</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="radio-group-append">
              <select class="form-control" disabled>
                <option selected>Kathmandu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div class="spacer-margin"></div>
          <button type="submit" class="btn btn-primary w-100 mb-4">
            Compute
          </button>
          <button type="submit" class="btn btn-danger w-100">
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
