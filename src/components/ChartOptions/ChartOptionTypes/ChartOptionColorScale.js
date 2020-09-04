import React, { useState, useMemo, useEffect, useCallback, useContext } from "react";
import { chart as rawChart } from "@raw-temp/rawgraphs-core"
import { Row, Col } from "react-bootstrap";
import get from "lodash/get";
import {
  getInitialScaleValues,
  getColorScale,
  getColorDomain,
  colorPresets,
  getTypeName,
} from "@raw-temp/rawgraphs-core";

const scaleTypes = Object.keys(colorPresets);

const CurrentPreset = ({ label, scale }) => {
  let samples;
  if (scale.ticks) {
    samples = scale.ticks();
  } else {
    samples = scale.domain();
  }
  return (
    <div>
      <div>{label}</div>
      <div className="d-flex">
        {samples.map((sample) => (
          <div
            key={sample}
            style={{ flex: 1, height: 10, background: scale(sample) }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const ChartOptionColorScale = ({
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  dimension,
  dataset,
  mapping,
  dataTypes,
  chart,
  mappedData,
  ...props
}) => {

  // const mappedDataset = useMemo(() => {
  //   try {
      
  //     const viz = rawChart(chart, {
  //       data: dataset,
  //       mapping,
  //       dataTypes,
  //       visualOptions: {},
  //     })
  //     return viz.mapData()
  //   } catch (e) {
  //     return undefined
      
  //   }
  // }, [chart, mapping, dataTypes, dataset])

  const [scaleType, setScaleType] = useState("ordinal");

  const mappingValue = useMemo(() => {
    return get(mapping, `[${dimension}].value`);
  }, [dimension, mapping]);

  const colorDataType = useMemo(() => {
    return dataTypes[mappingValue]
      ? getTypeName(dataTypes[mappingValue])
      : undefined;
  }, [dataTypes, mappingValue]);

  const availableScaleTypes = useMemo(() => {
    if (colorDataType === "number" || colorDataType === "date") {
      return scaleTypes;
    }
    return ["ordinal"];
  }, [colorDataType]);

  const colorDataset = useMemo(() => {
    if (mappedData) {
      return mappedData.map((d) => get(d, dimension));
    } else {
      return [];
    }
  }, [dimension, mappedData]);

  const interpolators = useMemo(() => {
    return Object.keys(colorPresets[scaleType]);
  }, [scaleType]);

  const [interpolator, setInterpolator] = useState(interpolators[0]);

  const [userValues, setUserValues] = useState([]);

  useEffect(() => {
    setInterpolator(interpolators[0]);
  }, [scaleType, interpolators]);

  useEffect(() => {
    setScaleType(availableScaleTypes[0]);
  }, [availableScaleTypes]);

  const setUserValueRange = useCallback(
    (index, value) => {
      const newUserValues = [...userValues];
      newUserValues[index].userRange = value;
      setUserValues(newUserValues);
    },
    [userValues]
  );

  const setUserValueDomain = useCallback(
    (index, value) => {
      const newUserValues = [...userValues];
      newUserValues[index].userDomain = value;
      setUserValues(newUserValues);
    },
    [userValues]
  );

  useEffect(() => {
    if (!colorDataset || !interpolator || !colorPresets[scaleType][interpolator]) {
      return;
    }
    if (!mappingValue) {
      return;
    }
    if (!colorDataType) {
      return;
    }

    const domain = getColorDomain(colorDataset, colorDataType, scaleType);
    const userValues = getInitialScaleValues(
      domain,
      scaleType,
      interpolator
    ).map((userValue) => ({
      ...userValue,
      userRange: userValue.range,
      userDomain: userValue.domain,
    }));
    setUserValues(userValues);
  }, [
    scaleType,
    interpolator,
    colorDataset,
    mapping,
    dimension,
    dataTypes,
    mappingValue,
    colorDataType,
  ]);

  const userValuesForFinalScale = useMemo(() => {
    return userValues.map((value) => ({
      range: value.userRange,
      domain: value.userDomain,
    }));
  }, [userValues]);

  const currentFinalScale = useMemo(() => {
    if (
      !colorDataset.length ||
      !colorDataType ||
      !scaleType ||
      !interpolator ||
      !userValuesForFinalScale ||
      !colorPresets[scaleType][interpolator]
    ) {
      return null;
    }

    const previewScale = getColorScale(
      colorDataset, //the array of values of the dataset mapped on the color dimension
      colorDataType,
      scaleType, //
      interpolator,
      userValuesForFinalScale
    );

    return previewScale;
  }, [
    colorDataType,
    colorDataset,
    interpolator,
    scaleType,
    userValuesForFinalScale,
  ]);


  useEffect(() => {
    const outScaleParams = {
      scaleType,
      interpolator,
      userScaleValues: userValuesForFinalScale,
    };
    onChange(outScaleParams);
  }, [interpolator, scaleType, userValuesForFinalScale]);

  return (
    <div>
      <Row>
        <Col xs={12}>{label}</Col>
      </Row>
      <Row>
        <Col xs={6}>Scale type</Col>
        <Col xs={6}>
          <select
            disabled={!colorDataType}
            className="custom-select"
            value={scaleType}
            onChange={(e) => {
              setScaleType(e.target.value);
            }}
          >
            {availableScaleTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      <Row>
        <Col xs={6}>Color scheme</Col>
        <Col xs={6}>
          <select
            disabled={!colorDataType}
            className="custom-select"
            value={interpolator}
            onChange={(e) => {
              setInterpolator(e.target.value);
            }}
          >
            {interpolators.map((interpolator) => (
              <option key={interpolator} value={interpolator}>
                {colorPresets[scaleType][interpolator].label}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      {currentFinalScale && (
        <Row>
          <Col xs={12}>
            <CurrentPreset
              scale={currentFinalScale}
              label={"Scale preview"}
            ></CurrentPreset>
          </Col>
        </Row>
      )}

      {colorDataType && userValues && (
        <div>
          {userValues.map((userValue, i) => (
            <Row key={i}>
              <Col xs={6}>
                {scaleType === "ordinal" && userValue.domain}
                {scaleType !== "ordinal" && (
                  <input
                    type="number"
                    value={userValue.userDomain || ''}
                    onChange={(e) => {
                      setUserValueDomain(i, e.target.value);
                    }}
                  ></input>
                )}
              </Col>
              <Col xs={6}>
                {userValue.range}
                <input
                  type="color"
                  value={userValue.userRange}
                  onChange={(e) => {
                    setUserValueRange(i, e.target.value);
                  }}
                ></input>
              </Col>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartOptionColorScale;
