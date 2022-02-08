import React, { useCallback } from "react"
import { useRecoilValue } from "recoil";
import { serviceState } from "../state/servicesState";

interface HeaderItemProps {
  index: number
}

export default (props: HeaderItemProps) => {
  const service = useRecoilValue(serviceState(props.index))
  const onClick = useCallback(() => {
    services.select({index: props.index})
  }, [props.index])
  return (<li onClick={onClick}>{service?.label || '+'}</li>)
}
