import React from 'react';
import { StyleSheet, Platform, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-elements';

export default class NutritionInfo extends React.Component {
    render() {
        return (
            <View style= {[styles.background, this.props.style]}>
                <Text style =  {styles.heading}>Nutrition Facts</Text>
                <Text style = {styles.subHeading}>Serving Size (230g)</Text>
                <Divider style = {styles.divider1}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background:{
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'column',
    }
});