import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, Line } from 'react-native-svg';

const LIGHT_PINK = '#FFB6C1';
const LIGHTER_PINK = '#FFF0F5';
const MEDIUM_PINK = '#FFD1DC';
const { width } = Dimensions.get('window');

const CommentSpectrumPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>1. Purely Intellectual Feed</Text>
        <View style={styles.subtitle2Container}>
          <Text style={styles.subtitle2}>Instant Productivity</Text>
        </View>
        <Text style={[styles.title, styles.commentSectionTitle]}>2. Comment Distribution</Text>
        <View style={styles.graphicOuterContainer}>
          <Svg height="200" width={width - 60}>
            {/* Left neighborhood */}
            <Path
              d="M0,0 Q60,0 60,100 Q60,200 0,200 Z"
              fill={LIGHT_PINK}
              opacity="0.3"
            />
            {/* Right neighborhood */}
            <Path
              d={`M${width - 60},0 Q${width - 120},0 ${width - 120},100 Q${width - 120},200 ${width - 60},200 Z`}
              fill={LIGHT_PINK}
              opacity="0.3"
            />
            {/* Populate with dots */}
            {[...Array(200)].map((_, i) => (
              <Circle
                key={i}
                cx={Math.random() * (width - 60)}
                cy={Math.random() * 200}
                r={1.5}
                fill={LIGHTER_PINK}
                opacity={Math.random() * 0.5 + 0.5}
              />
            ))}
            {/* More dense dots for Instagram comments */}
            {[...Array(100)].map((_, i) => (
              <Circle
                key={i + 200}
                cx={Math.random() * 60}
                cy={Math.random() * 200}
                r={1.5}
                fill={LIGHTER_PINK}
                opacity={Math.random() * 0.5 + 0.5}
              />
            ))}
            {/* More dense dots for Plato, Socrates */}
            {[...Array(100)].map((_, i) => (
              <Circle
                key={i + 300}
                cx={Math.random() * 60 + (width - 120)}
                cy={Math.random() * 200}
                r={1.5}
                fill={LIGHTER_PINK}
                opacity={Math.random() * 0.5 + 0.5}
              />
            ))}
          </Svg>
        </View>
        <View style={styles.labelsContainer}>
          <View style={styles.labelColumn}>
            <Svg height="20" width="40">
              <Path d="M20,0 L20,15 M15,10 L20,15 L25,10" stroke={LIGHTER_PINK} strokeWidth="1.5" fill="none" />
            </Svg>
            <Text style={styles.label}>Instagram</Text>
            <Text style={styles.label}>Degeneracy</Text>
          </View>
          <View style={styles.labelColumn}>
            <Svg height="20" width="40">
              <Path d="M20,0 L20,15 M15,10 L20,15 L25,10" stroke={LIGHTER_PINK} strokeWidth="1.5" fill="none" />
            </Svg>
            <Text style={styles.label}>Plato,</Text>
            <Text style={styles.label}>Socrates</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    marginTop: -20,
  },
  contentContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 31,
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'AbhayaLibre-Bold',
    paddingBottom: 40,
    alignSelf: 'flex-start',
    width: '100%',
  },
  subtitle2Container: {
    borderColor: MEDIUM_PINK,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  subtitle2: {
    fontSize: 40,
    color: LIGHTER_PINK,
    fontFamily: 'AbhayaLibre-Regular',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  graphicOuterContainer: {
    borderColor: MEDIUM_PINK,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  commentSectionTitle: {
    paddingTop: 40,
    marginBottom: -5,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  labelColumn: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: LIGHTER_PINK,
    fontFamily: 'AbhayaLibre-Regular',
    textAlign: 'center',
  },
});

export default CommentSpectrumPage;