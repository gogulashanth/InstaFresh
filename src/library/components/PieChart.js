import React from 'react';
import {
  Image, View, StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { pie, arc } from 'd3-shape';


export default class PieChart extends React.PureComponent {
  static defaultProps = {
    endAngle: 2 * Math.PI,
  }

  constructor(props) {
    super(props);
    this.arcGenerator = arc().padAngle(0.05).cornerRadius(5);

    this.pieGenerator = pie();
    this.pieGenerator.value(d => d.value).sort(null);

    this.state = { width: 100, height: 100 };
  }

  animateView = (() => {

  });

  onLayout = ((event) => {
    this.setState({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height });
  });

  renderArc(arcData) {
    const { width, height } = this.state;
    const maxSize = Math.min(width, height) / 2;
    this.arcGenerator.innerRadius(maxSize - 10).outerRadius(maxSize);

    const pathData = this.arcGenerator({
      startAngle: arcData.startAngle,
      endAngle: arcData.endAngle,
    });

    return (
      <Path
        key={Math.random()}
        d={pathData}
        fill={arcData.data.color}
        stroke={arcData.data.color}
      />
    );
  }

  render() {
    const {
      style,
      segmentValues,
      endAngle,
    } = this.props;

    const { width, height } = this.state;

    this.pieGenerator.endAngle(endAngle);
    const pieData = this.pieGenerator(segmentValues);
    
    return (
      <View
        style={{ ...styles.container, ...style }}
        onLayout={event => this.onLayout(event)}
      >
        <Svg height={height} width={width} viewBox={`${-width/2} ${-height/2} ${width} ${height}`}>
          {pieData.map(e => this.renderArc(e))}
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
