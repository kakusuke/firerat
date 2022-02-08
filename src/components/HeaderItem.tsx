import React, { useCallback, MouseEvent } from "react"
import { useRecoilValue } from "recoil";
import { serviceState } from "../state/servicesState";

interface HeaderItemProps {
  index: number
}

export default (props: HeaderItemProps) => {
  const service = useRecoilValue(serviceState(props.index))
  const onClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    services.select({index: props.index})
  }, [props.index])
  return (<a onClick={onClick}>{service?.label || '+'}</a>)
}
