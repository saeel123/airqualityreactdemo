import axios from "axios";
const SERVER_URL = "http://smog.icimod.org/apps";

//let defaultobservationstation = `${SERVER_URL}/airquality/defaultobservationstation/?typeName=${typeName}&startDate=${startDate}&endDate=${endDate}-${currentTimeHrMin}`;
let defaultobservationstation = `/data/defaultobservationstation.json`;
export const getDefaultObservationStation = (
  typeName,
  startDate,
  endDate,
  currentTimeHrMin
) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(defaultobservationstation)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject("Error in getAccountDetials Axios!");
        });
    } catch (error) {
      console.error(
        "in billingPlanServices > getAccountDetails, Err===",
        error
      );
      reject("SYSTEM_ERROR");
    }
  });
};

//let getStationListUrl = `http://smog.icimod.org/apps/airquality/getGeoJsonForOneSatation/?ModelClass=UsEmbassyPm&ModelClassDataList=UsEmbassyDataList&typeName=pm&StartDate=${startDate}&EndDate=${endDate}&rid=0`;
let getStationListUrl = "/data/stationList.json";
export const getObservationStationList = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(getStationListUrl)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject("Error in getAccountDetials Axios!");
        });
    } catch (error) {
      console.error(
        "in billingPlanServices > getAccountDetails, Err===",
        error
      );
      reject("SYSTEM_ERROR");
    }
  });
};

// let getStationChartDataUrl = "http://smog.icimod.org/apps/airquality/getData/";
let getStationChartDataUrl = "/data/dataListChart.json";

export const getStationChartData = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(getStationChartDataUrl)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject("Error in getAccountDetials Axios!");
        });
    } catch (error) {
      console.error(
        "in billingPlanServices > getAccountDetails, Err===",
        error
      );
      reject("SYSTEM_ERROR");
    }
  });
};
