import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{headerShown:false,title:"Home"}} />
      {/* <Tabs.Screen name="profile" /> */}
    </Tabs>
  )
}

export default _Layout