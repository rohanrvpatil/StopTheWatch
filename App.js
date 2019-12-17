import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';

function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())}:</Text>
      <Text style={style}>{Math.floor(pad(duration.milliseconds() / 10))}</Text>
    </View>
  )

};

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: background }]}
      onPress={() => !disabled && onPress()}
      activeOpacity={disabled ? 1.0 : 0.7}

    >
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, { color }]}>{title} </Text>
      </View>
    </TouchableOpacity>
  );
}

function ButtonRow({ children }) {
  return (
    <View style={styles.buttonRow}>
      {children}
    </View>
  );
}

function Lap({ number, interval, fastest, slowest }) {
  const lapStyle = [
    styles.lapText,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ]

  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Lap {number}:</Text>
      <Timer style={[lapStyle, styles.lapTimer]} interval={interval} />
    </View>
  )
}

function LapsTable({ laps, timer }) {
  const finishedLaps = laps.slice(1)
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach(lap => {
      if (lap < min) min = lap
      if (lap > max) max = lap


    });
  }


  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((interval, number) => (
        <Lap number={laps.length - number}
          key={laps.length - number}
          interval={number == 0 ? timer + interval : interval}
          slowest={interval == max}
          fastest={interval == min}
        />
      ))}
    </ScrollView>
  )
}


export default class MainApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      now: 0,
      laps: []
    }

  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      laps: [0],

    })

    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() })
    }, 100)


  }


  lap = () => {
    const timeStamp = new Date().getTime()
    const { laps, now, start } = this.state
    const [firstLap, ...other] = laps

    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timeStamp,
      now: timeStamp,


    })
  }

  stop = () => {
    clearInterval(this.timer)
    const { laps, now, start } = this.state
    const [firstLap, ...other] = laps

    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,


    })
  }

  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0
    })
  }

  resume = () => {
    const now = new Date().getTime()
    this.setState({
      start:now,
      now
    })

    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() })
    }, 100)
  }


  render() {
    const { now, start, laps } = this.state
    const timer = now - start
    return (
      <View style={styles.container}>
        <Timer interval={laps.reduce((total, curr) => total + curr, 0) + timer} style={styles.timerStyle} ></Timer>

        {laps.length == 0 && (
          <ButtonRow >
            <RoundButton title="Lap" color="#212121" background="#424242" disabled></RoundButton>
            <RoundButton
              title="Start"
              color="#00e676"
              background="#1b5e20"
              onPress={this.start}
            >
            </RoundButton>
          </ButtonRow>
        )
        }

        {start > 0 && (
          <ButtonRow>
            <RoundButton title="Lap" color="#FFFFFF" background="#424242" onPress={this.lap}></RoundButton>
            <RoundButton
              title="Stop"
              color="#d50000"
              background="maroon"
              onPress={this.stop}
            >
            </RoundButton>
          </ButtonRow>
        )}

        {laps.length>0 && start == 0 && (
          <ButtonRow>
            <RoundButton
              title="Reset"
              color="#00e676"
              background="#1b5e20"
              onPress={this.reset}
              >
              </RoundButton>
            <RoundButton
              title="Start"
              color="#d50000"
              background="maroon"
              onPress={this.resume}
            >
            </RoundButton>
          </ButtonRow>
        )}



        <LapsTable laps={laps} timer={timer} />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    paddingTop: 130,
    paddingLeft: 25,
    paddingRight: 25
  },

  timerStyle: {
    fontSize: 65,
    color: "white",
    fontWeight: "200",
    width: 95
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center"
  },

  buttonTitle: {
    fontSize: 18,

  },

  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2
  },

  buttonRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: 86,
    marginBottom: 60
  },

  lapText: {
    color: "white",
    fontSize: 20,

  },

  lapTimer: {
    width: 33
  },

  lap: {

    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#424242",
    borderTopWidth: 1,
    paddingVertical: 16
  },

  scrollView: {
    alignSelf: "stretch"
  },

  fastest: {
    color: "#00e676"
  },

  slowest: {
    color: "#f44336"
  },

  timerContainer: {
    flexDirection: "row"
  }



});
