import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { BsClipboard, BsUpload, BsGift, BsFolder } from "react-icons/bs";
import DataSamples from '../DataSamples/DataSamples';

import ParsingOptions from '../ParsingOptions';

export default function DataLoader({data,setData}){
  const options = [
      {
          id: 'paste',
          name: 'Paste your data',
          loader: 'insert here a text area input',
          message:'Copy and paste your data from other applications or websites. You can use tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
          icon: BsClipboard
      },
      {
          id: 'upload',
          name: 'Upload your data',
          loader: 'insert here a drop zone / file loader that accepts datasets',
          message:'You can load tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
          icon: BsUpload
      },
      {
          id: 'samples',
          name: 'Try our data samples',
          message:'Wanna know more about what you can do with RAWGraphs?',
          loader: <DataSamples />,
          icon: BsGift,
          separator: true
      },
      {
          id: 'project',
          name: 'Open your project',
          message:'Load a .rawgraphs project. Questions about how to save your work?',
          loader: 'insert here a drop zone / file loader that accepts .rawgraphs files',
          icon: BsFolder,
          separator: true
      }
  ]
  const [option, setOption] = useState(options[0]);
  return (
    <>
      <Row>
        <Col xs={2}></Col>
        <Col>
          <ParsingOptions />
        </Col>
      </Row>
      <Row>
        <Col xs={2} className="pl-3 pr-0" style={{marginTop:'-8px'}}>
          {
            options.map(d=>{
              return (
                <div key={d.id} className={`w-100 d-flex align-items-center loading-option ${d.id===option.id?'active':''}`} style={d.separator?{borderTop:'1px solid var(--light)'}:{}}>
                  <div className="w-100 d-flex flex-row align-items-center" onClick={()=>setOption(d)}>
                    <d.icon className="w-25" />
                    <h4 className="m-0 d-inline-block">{d.name}</h4>
                  </div>
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
                  <div style={{backgroundColor:'white', minHeight:'300px', height:'50vh'}}>{option.loader}</div>
                  <div><p>{option.message} <a href="https://rawgraphs.io/learning" target="_blank" rel="noopener noreferrer">Check out our guides</a>.</p></div>
                </>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}