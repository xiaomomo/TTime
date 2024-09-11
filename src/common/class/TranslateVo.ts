/*
 * @Author: lqj01900964 lqj01900964@alibaba-inc.com
 * @Date: 2024-09-10 18:24:32
 * @LastEditors: lqj01900964 lqj01900964@alibaba-inc.com
 * @LastEditTime: 2024-09-11 09:53:54
 * @FilePath: /TTime/src/common/class/TranslateVo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 翻译结果
 */
class TranslateVo {
  /**
   * 请求ID
   */
  requestId: string

  /**
   * 翻译服务ID
   */
  translateServiceId: string

  /**
   * 翻译结果列表
   */
  translateList: string[] | string

  /**
   * 音标
   */
  phonetic!: string

  /**
   * 美式音标
   */
  usPhonetic!: string

  /**
   * 英式音标
   */
  ukPhonetic!: string

  /**
   * 美式发音
   */
  usSpeech!: string

  /**
   * 英式发音
   */
  ukSpeech!: string

  /**
   * 解释
   */
  explains!: Array<string>

  /**
   * 其他形式
   */
  wfs!: Array<object>

  /**
   * 翻译实践
   */
  translateTime!: string

  constructor(translateList: string[] | string) {
    this.translateList = translateList
  }

  dictBuild(info, usPhonetic, ukPhonetic, usSpeech, ukSpeech, explains, wfs): void {
    this.requestId = info.requestId
    this.translateServiceId = info.id
    this.usPhonetic = usPhonetic
    this.ukPhonetic = ukPhonetic
    this.usSpeech = usSpeech
    this.ukSpeech = ukSpeech
    this.explains = explains
    this.wfs = wfs
  }

  dictLessBuild(info, phonetic, explains, wfs): void {
    this.requestId = info.requestId
    this.translateServiceId = info.id
    this.phonetic = phonetic
    this.explains = explains
    this.wfs = wfs
  }
}

export default TranslateVo
