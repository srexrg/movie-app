import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const HAS_ONBOARDED = 'has_onboarded';

const ONBOARDING_DATA = [
  {
    id: 1,
    title: 'Welcome to MovieDB',
    description: 'Your ultimate movie companion for discovering the latest and greatest in cinema.',
    image: { uri: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800' },
  },
  {
    id: 2,
    title: 'Discover Movies',
    description: 'Browse through thousands of movies, get detailed information, and watch trailers.',
    image: { uri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800' },
  },
  {
    id: 3,
    title: 'Save Your Favorites',
    description: 'Create your watchlist and keep track of movies you want to watch later.',
    image: { uri: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800' },
  },
];

const OnboardingItem = ({ item, index, scrollX }: any) => {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [1.1, 1, 1.1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }} className="relative">
      <Animated.View className="absolute inset-0" style={imageAnimatedStyle}>
        <Image 
          source={item.image} 
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          className="absolute inset-0"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/50" />
      </Animated.View>
      <View className="flex-1 items-center justify-center px-8 z-10">
        <Text style={{fontFamily:'Poppins_800ExtraBold'}} className="text-4xl text-white mb-4 text-center">
          {item.title}
        </Text>
        <Text style={{fontFamily:"Poppins_700Bold"}} className="text-lg text-light-200 text-center">
          {item.description}
        </Text>
      </View>
    </View>
  );
};

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<typeof ONBOARDING_DATA[0]>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(HAS_ONBOARDED, 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" backgroundColor="#030014" />
      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={({ item, index }) => (
          <OnboardingItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(newIndex);
        }}
      />

      <View className="absolute bottom-20 left-0 right-0 z-20">
        <View className="flex-row justify-center space-x-2 mb-8">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? 'w-6 bg-accent' : 'w-2 bg-light-300'
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-accent mx-8 p-4 rounded-full"
        >
          <Text style={{ fontFamily:"Poppins_700Bold"}} className="text-white text-center text-lg">
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
