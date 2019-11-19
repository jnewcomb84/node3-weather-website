const request = require('request');

const forecast = (longitude, latitude, cb) => {
    const url = "https://api.darksky.net/forecast/0d0c7132b0a82561f85815526c478022/" + encodeURIComponent(latitude) + "," + encodeURIComponent(longitude) + "?units=us&exclude=minutely,hourly,alerts,flags";

    request({ url, json: true }, (err, {body}) => {
         if(err) {
             cb("Could not connect to forecast API!");
         }
         else if(body.error) {
             cb("Unable to find the given location");
         }
         else {
            cb(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`);
         }
    });
};

module.exports = forecast;