//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
    Platform,
  TouchableOpacity
} from "react-native";
import ScreenFlex from "./ScreenFlex";
import { Audio, File, getFileNameFromFileURL } from "./utils/common";
import RCTDeviceEventEmitter from "RCTDeviceEventEmitter";

class AudioStyleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isRecord: false
    };
    // this._change_modal_state = this._change_modal_state.bind(this);
  }

  _change_modal_state(isShow) {
    this.setState({
      show: isShow
    });
  }

  /**
   * 开始录制
   * @memberof AudioStyleModal
   */
  startRecord() {
    this.setState({
      isRecord: !this.state.isRecord
    });
    if (!this.state.isRecord) {
      //开始录制
      Audio.startRecord(result => {});
      
    } else {
      //停止录制
      Audio.stopRecord(result => {
        //关闭录制音频的图层
        this._change_modal_state(false)

        
        let { status, voice_len, audioFileURL } = result;
        url = "https://cfs-dev.ykbenefit.com/chat/zrk/upload"; //开发
          console.log('****************  audioFileURL', audioFileURL)


        let files = {
          uri: Platform.OS ==='ios'? audioFileURL : "file://" + audioFileURL,
          type: "application/octet-stream",
          name: getFileNameFromFileURL(audioFileURL)
        };
        let data = new FormData();
        data.append("file", files);
        File.upload(url, data, {
          headers: {
            access_token: "o6NPBHKuVb_DtMbGa6HxWA"
          }
        }).then(result => {
          
          //上传成功以后，将音频文件插入到HTML5中。
          if(result.status === 'success'){
            this.props.getEditor().insertAudio({src: '../img/left_voice_icon.png', audio: result.data.url});
          }else{
            console.log("====================================");
            console.log("上传音频失败", result);
            console.log("====================================");
          }
        

        });
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal

          transparent={true}
          visible={this.state.show}
          animationType={'slide'}
          onRequestClose={() => this.setState({show: false})}

        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "flex-end"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#dddddd",
                height: 180
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.startRecord.bind(this)}
              >
                <Image
                  style={
                    !this.state.isRecord
                      ? { width: 90, height: 90 }
                      : { width: 150, height: 150 }
                  }
                  source={
                    this.state.isRecord
                      ? require("../img/voice_recording.gif")
                      : require("../img/record_icon.png")
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal
          >
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECF0"
  }
});

//make this component available to the app
export default AudioStyleModal;
