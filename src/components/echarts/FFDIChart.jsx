import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';

export default class  FFDIChart extends React.Component {

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
    //Inititialisation only called once and use to set the default values for the Location and the Drought Factor
    componentDidMount() {
        var targetUrl = 'http://localhost:5000/FFDI/<'+this.props.selectedLocation +'>/<' + this.props.selectedFactor + '>'
        fetch(targetUrl, {mode: 'cors'})
        .then(res => res.json())
        .then(data => this.setState({data}))
      .catch(console.log);
    }
   //Used for every knew update of the location and the Drought Factor
    componentDidUpdate(prevProps) {
      var targetUrl = 'http://localhost:5000/FFDI/<'+this.props.selectedLocation +'>/<' + this.props.selectedFactor + '>'
      if (this.props.selectedLocation !== prevProps.selectedLocation || 
        this.props.selectedFactor !== prevProps.selectedFactor){
        fetch(targetUrl, {mode: "cors"})
        .then(res => res.json())
        .then(data => this.setState({data}))
        .catch(console.log);
        }
  }


    getLineOptions() {
      /**
       * This function creates the options for the line chart rendered
       */

        const dates = this.state.data.labels; // dates fetched using API
        // specifies style of lineBarTooptip
        const lineBarTooltip = {
            trigger: "axis",
            axisPointer: {
              crossStyle: {
                color: "#999",
              },
            },
          };
        
        const dataLocation = 'ffdi_' + this.props.selectedLocation; // used to get data from the fetched response

        let tempOption = {
            title: {
              text: 'Forest Fire Danger Index',
              x: 'center',
              textColor: 'white'
            },
            grid: {
              containLabel: true,
              left: 0,
              right: "5%",
              bottom: "10%",
              top: "54px",
            },
            tooltip: lineBarTooltip,
            dataZoom: [                                // data zoom feature used for chronological filtering
              {
                type: "inside"
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
              max: 100
            },
            series: [
                {
                    type: 'line',
                    data: this.state.data[dataLocation],
                    lineStyle: {
                      color: '#7d1818',
                  },
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