import React from 'react';
import ReactEcharts from "echarts-for-react";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';

/**
 * RainChart displays the rainfall for the selected location
 * using a line chart.
 */
export default class  RainChart extends React.Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            temperatures: [],
            labels: [],
            data: []
        }
        this.getLineOptions.bind(this);
    }
      
    componentDidMount() {
      /**
       * This function fetches new rainfall data when the component first mounts
       */
      var url = 'http://localhost:5000/rainfall/<' + this.props.selectedLocation +'>'
        fetch(url)
        .then(res => res.json())
        .then(data => this.setState({data}))
      .catch(console.log);
    }
    
    componentDidUpdate(prevProps) {
      /**
       * This function fetches new Rainfall data each time the user selects a new
       * location
       * @param prevProps the previously selected location to ensure data only fetched
       * when user selects a NEW location
       */
      var url = 'http://localhost:5000/rainfall/<' + this.props.selectedLocation +'>'
      if (this.props.selectedLocation !== prevProps.selectedLocation){
        fetch(url)
        .then(res => res.json())
        .then(data => this.setState({data}))
      .catch(console.log);
      }
    }

    getLineOptions() {
       /**
       * This function creates the options for the line chart rendered
       */
        const dates = this.state.data.labels;  // dates fetched using API
        // specifies style of lineBarTooptip
        const lineBarTooltip = {
            trigger: "axis",
            axisPointer: {
              crossStyle: {
                color: "#999",
              },
            },
          };
        
        const dataLocation = 'rain_' + this.props.selectedLocation; // used to get data from the fetched response

        let tempOption = {
            title: {
                text: 'Rainfall (mm)',
                x: 'center'
            },
            grid: {
              containLabel: true,
              left: 0,
              right: "5%",
              bottom: "10%",
              top: "54px",
            },
            tooltip: lineBarTooltip,
            dataZoom: [                                   // data zoom feature used for chronological filtering
              { 
                type: "inside",
              },
              {
                start: 0,
                end: 10,
                handleSize: "80%",
                handleStyle: {
                  color: "#fff",
                  shadowBlur: 3,
                  shadowColor: "rgba(0, 0, 0, 0.6)",
                  shadowOffsetX: 2,
                  shadowOffsetY: 2,
                },
                top: "92%",
                bottom: "1%",
                left: "center",
              },
            ],
            xAxis: {
              type: "category",
              data: dates,
            },
            yAxis: {
              type: "value",
              min: 0,
              max: 150
            },
            series: [
                {
                    type: 'line',
                    data: this.state.data[dataLocation],
                    lineStyle: {
                      color: '#b25c22'
                    }
                }
            ]
          };
          return tempOption;
    }

    render () {
        let lineOption;
        lineOption = this.getLineOptions(); 
        // Use Apache eCharts to visualise data using previously defined line options
        return (
            <ReactEchartsCore echarts={echarts} option={lineOption} />
        );
}
}