import React, { useState, useEffect } from 'react';
import styles from './DataLoader.module.scss';
import { Row, Col, Alert } from 'react-bootstrap';
import { BsClipboard, BsUpload, BsGift, BsFolder, BsTrashFill } from "react-icons/bs";
import DataSamples from '../DataSamples/DataSamples';

import localeList from './localeList';
import ParsingOptions from '../ParsingOptions';

export default function DataLoader({data,setData}){
  const options = [
    {
      id: 'paste',
      name: 'Paste your data',
      loader: <div style={{backgroundColor:'white', border:'1px solid lightgrey', borderRadius:4, padding:'1rem', minHeight:'250px', height:'40vh'}}><span role="img" aria-label="work in progress">⏳</span> this will be a text area input</div>,
      message:'Copy and paste your data from other applications or websites. You can use tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
      icon: BsClipboard
    },
    {
      id: 'upload',
      name: 'Upload your data',
      loader: <div style={{backgroundColor:'white', border:'1px solid lightgrey', borderRadius:4, padding:'1rem', minHeight:'250px', height:'40vh'}}><span role="img" aria-label="work in progress">⏳</span> this will be a drop zone / file loader that accepts datasets</div>,
      message:'You can load tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
      icon: BsUpload
    },
    {
      id: 'samples',
      name: 'Try our data samples',
      message:'Wanna know more about what you can do with RAWGraphs?',
      loader: <DataSamples setData={setData} />,
      icon: BsGift
    },
    {
      id: 'project',
      name: 'Open your project',
      message:'Load a .rawgraphs project. Questions about how to save your work?',
      loader: <div style={{backgroundColor:'white', border:'1px solid lightgrey', borderRadius:4, padding:'1rem', minHeight:'250px', height:'40vh'}}><span role="img" aria-label="work in progress">⏳</span> this will be a drop zone / file loader that accepts .rawgraphs files</div>,
      icon: BsFolder
    },
    {
      id: 'clear',
      name: 'Clear',
      message:null,
      loader:null,
      icon: BsTrashFill
    }
  ]
  const [option, setOption] = useState(options[0]);

  // Parsing Options
  const [locale, setLocale] = useState('en-CA');
  const [separator, setSeparator] = useState(',');

  useEffect(() => {
    if (option.id==='clear') {
      setOption(options[0]);
      setData();
    }
  },[option.id, options, setData]);

  return (
    <>
      <Row>
        <Col xs={{span: 9, order: null, offset: 3}} lg={{span: 10, order: null, offset: 2}} style={{height:'64px'}}>
          <ParsingOptions locale={locale} setLocale={setLocale} localeList={localeList} separator={separator} setSeparator={setSeparator} dimensions={data?data.columns:[]} />
        </Col>
      </Row>
      <Row>
        <Col xs={3} lg={2} className="d-flex flex-column justify-content-start pl-3 pr-0 options" style={{marginTop:'-8px'}}>
          {
            options.map((d,i)=>{
              return (
                <div
                  key={d.id}
                  className={
                    `w-100 d-flex align-items-center no-select cursor-pointer ${styles['loading-option']}${d.id===option.id?` ${styles.active}`:''}${(data&&i<options.length-1)?` ${styles.disabled}`:''}`
                  }
                  onClick={()=>setOption(d)}
                >
                  <d.icon className="w-25" />
                  <h4 className="m-0 d-inline-block">{d.name}</h4>
                </div>
              )
            })
          }
        </Col>
        <Col>
          <Row>
            <Col>
                  { !data &&
                    <>
                      {option.loader}
                      <p className="mt-3">{option.message} <a href="https://rawgraphs.io/learning" target="_blank" rel="noopener noreferrer">Check out our guides</a>.</p>
                    </>
                  }
                  { data &&
                    <>
                      <div style={
                        {
                          backgroundColor:'white',
                          border:'1px solid lightgrey',
                          borderRadius:4,
                          padding:'1rem',
                          minHeight:'250px',
                          height:'40vh',
                          overflowY:'auto',
                          marginBottom:'1rem'
                        }
                      }>
                        Data is loaded, but not displayed.
                        <br/><span className="cursor-pointer underlined" onClick={()=>{console.log(data.columns); console.log(data);}}>Click here to console-log it</span>!
                        <br/>(Currently RAW uses d3.autoType to guess data types.)
                      </div>

                      <Alert variant="success"><p className="m-0">{data.length} records in your data have been successfully parsed!</p></Alert>
                      <Alert variant="warning"><p className="m-0">Ops here something seems weird. Check row {'1234321'}!</p></Alert>
                      <Alert variant="danger"><p className="m-0">Whoops! Something wrong with the data you provided. Refresh the page!</p></Alert>
                    </>
                  }
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}