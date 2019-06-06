import React from 'react';
import { Animated } from 'react-native';
import SVG, { G, Path } from 'react-native-svg';
import * as shape from 'd3-shape';

export default class InstaScoreChart extends React.Component {
  render() {
    const { width, height, amount, color } = this.props;
    let Slice = 
    return (
      <View style={styles.container}>
        <Svg
          width={width}
          style={styles.pieSVG}
          height={height}
          viewBox="-100 -100 200 200"
        >
          <G>
            {
              Animated.createAnimatedComponent(Slice)
            }
          </G>
        </Svg>
      </View>

    );
  }
}

class Slice extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        const { size } = this.props;
        this.arcGenerator = d3.shape.arc()
            .outerRadius(100)
            .padAngle(0)
            .innerRadius(0);
    }

    createPieArc = (index, endAngle, data) => {

        const arcs = d3.shape.pie()
            .value((item)=>item.number)
            .startAngle(0)
            .endAngle(endAngle)
            (data);

        let arcData = arcs[index];

        return this.arcGenerator(arcData);
    };


    render() {

        const {
            endAngle,
            color,
            index,
            data
        } = this.props;
        let val = data[index].number;

        return (
            <Path
                onPress={()=>alert('value is: '+val)}
                d={this.createPieArc(index, endAngle, data)}
                fill={color}
            />
        )

    }
}