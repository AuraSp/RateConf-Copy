import React, { Fragment } from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import QueryCard from './QueryCard';
import RateData from './Rate/RateData';
import RatePickUp from './Rate/RatePickUp';
import RateDelivery from './Rate/RateDelivery';

const QueryCheck = () => {
  const [queryId, setQueryId] = useState('');
  const [response, setResponse] = useState([]);
  const [load, setLoad] = useState(true);

  const handleChangeQuery = event => {
    setQueryId(event.target.value);
  }

  const handleClick = event => {
    event.preventDefault();
    const data = JSON.stringify({
      id: queryId
    })

    // console.log(data);

    const url = 'http://localhost:5000/api/v1/pdf_api' + '?id=' + queryId;

    axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer gg',
        'Access-Control-Allow-Origin': "*",
      }
    }).then((res) => {
      setResponse(res.data.query[0]);
      console.log(res.data.query[0]);
    }).catch((error) => {
      console.error(error)
    })
  };

  const updateData = () => {
    if (response.length !== 0) {
      if (response.status === "finished") {
        //console.log("finished!!!! :)))))))");
        const stringData = response.rate_conf_data;
        var requiredData = stringData.match(/"([^']+)"/)[0];
        var reg = /"(.*?)"/i;
        var allData = [];
        //15
        for (let i = 0; i < 15; i++) {
          allData.push(requiredData.match(reg)[1]);
          requiredData = requiredData.replace(requiredData.match(reg)[0], '')
        }
        //console.log(allData)
        console.log("Job is finished");
        document.getElementById("jobStatus").innerHTML = "Job is finished."
        setLoad(false)
      }
      else if (response.status === "processing") {
        console.log("The Document is still being processed");
        document.getElementById("jobStatus").innerHTML = "The Document is still being processed."
      }
    }
  }

  useEffect(() => {
    updateData();
  }, [response])

  return (
    <div>
      <div id="checkQuery">
        <h2>Check by entering your Query ID</h2>
        <form>
          <label>
            <input id="queryIdInput" value={queryId} onChange={handleChangeQuery} type="text"></input>
          </label>
          <button id='requestButton' onClick={handleClick}>Click me</button>
        </form>
        <h3 id='jobStatus'></h3>
        {!load &&
          <div className='responseBlock'>
            <div className='cardBlock'>
              <React.Fragment key={response.id}>
                <QueryCard
                  response={response} />
              </React.Fragment>
            </div>
            <div className='rateBlock'>
              <React.Fragment key={response.id}>
                <RateData
                  response={response} />
              </React.Fragment>
            </div>
            <div className='rate2Block'>
              <React.Fragment key={response.id}>
                <RatePickUp
                  response={response} />
              </React.Fragment>
            </div>
            <div className='rate3Block'>
              <React.Fragment key={response.id}>
                <RateDelivery
                  response={response} />
              </React.Fragment>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default QueryCheck