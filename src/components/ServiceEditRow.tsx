import React, { ChangeEvent, useCallback } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { serviceDraftState, serviceState } from "../state/servicesState";

interface HeaderItemProps {
  index: number
}

export default (props: HeaderItemProps) => {
  const [service, setService] = useRecoilState(serviceDraftState(props.index))

  const onChangeSessionId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setService(old => ({...old, sessionId: e.target.value.trim()}))
  }, [])
  const onChangeLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setService(old => ({...old, label: e.target.value.trim()}))
  }, [])
  const onChangeUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setService(old => ({...old, url: e.target.value.trim()}))
  }, [])

  const onDelete = useCallback(() => {
    setService(old => null)
  }, [])

  return (service && <tr>
    <td><input type="text" value={service.sessionId} onInput={onChangeSessionId}/></td>
    <td><input type="text" value={service.label} onInput={onChangeLabel}/></td>
    <td><input type="text" value={service.url} onInput={onChangeUrl}/></td>
    <td><button type="button" onClick={onDelete}>-</button></td>
  </tr>)
}
