import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export class index extends Component {
  render() {
    return (
      <SafeAreaView>
<View>
        <Text className='text-red-600'> textInComponent </Text>
      </View>
      </SafeAreaView>
      
    )
  }
}

export default index
