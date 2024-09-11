/*
 * @Author: lqj01900964 lqj01900964@alibaba-inc.com
 * @Date: 2024-09-10 18:24:32
 * @LastEditors: lqj01900964 lqj01900964@alibaba-inc.com
 * @LastEditTime: 2024-09-11 10:26:25
 * @FilePath: /TTime/src/renderer/src/utils/translateRecordUtil.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { cacheGetByType, cacheSetByType } from './cacheUtil'
import { StoreTypeEnum } from '../../../common/enums/StoreTypeEnum'
import TranslateRecordVo from '../../../common/class/TranslateRecordVo'
import { isNull } from '../../../common/utils/validate'
import TranslateServiceRecordVo from '../../../common/class/TranslateServiceRecordVo'
import { translateRecordSave, TranslateRecordSavePo } from '../api/translateRecord'
import { isMemberVip } from './memberUtil'

/**
 * 更新翻译记录
 *
 * @param translateVo 翻译结果
 */
export const updateTranslateRecord = (translateVo): void => {
  const requestId = translateVo['requestId']
  // 翻译记录
  const translateRecordList = cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList')
  for (let i = 0; i < translateRecordList.length; i++) {
    const translateRecord = translateRecordList[i]
    if (translateRecord['requestId'] === requestId) {
      const translateServiceRecordList = translateRecord['translateServiceRecordList']
      for (let j = 0; j < translateServiceRecordList.length; j++) {
        const translateServiceRecord = translateServiceRecordList[j]
        if (translateServiceRecord.translateServiceId === translateVo['translateServiceId']) {
          const newTranslateInfo = JSON.parse(JSON.stringify(translateVo))
          // 最上层对象已经记录过了服务ID和请求ID，所以这里移除重复记录字段
          delete newTranslateInfo.translateServiceId
          delete newTranslateInfo.requestId
          newTranslateInfo.translateTime = new Date().getTime()
          translateServiceRecord['translateVo'] = newTranslateInfo
          translateServiceRecord.translateStatus = true
        }
      }
      if (isMemberVip()) {
        if (
          translateServiceRecordList.every(
            (translateServiceRecord: TranslateServiceRecordVo) =>
              translateServiceRecord.translateStatus
          )
        ) {
          translateRecordSave(TranslateRecordSavePo.build(translateRecord)).then(() => {})
        }
      }
    }
  }
  cacheSetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList', translateRecordList)
}

/**
 * 获取翻译记录
 *
 * @return 翻译记录
 */
export const getTranslateRecordList = (): Array<TranslateRecordVo> => {
  const res = cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList')
  return isNull(res) ? [] : res
}

/**
 * 获取翻译记录数量
 */
export const getTranslateRecordSize = (): number => {
  const size = cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordSize')
  return isNull(size) ? 0 : size
}

/**
 * 更新翻译记录
 *
 * @return 翻译记录列表
 */
export const updateTranslateRecordList = (translateRecordList): void => {
  const translateRecordSize = translateRecordList.length
  // 如果数组的长度超过了30，移除第一个元素
  if (translateRecordSize >= 30) {
    translateRecordList.shift()
  }
  cacheSetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordSize', translateRecordSize)
  cacheSetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList', translateRecordList)
}
