import React from "react"
import { useRecoilValue } from "recoil";
import { servicesState } from "../state/servicesState";
import HeaderItem from "./HeaderItem";

export default () => {
  const services = useRecoilValue(servicesState)

  return (
    <header>
      <nav>
        <HeaderItem index={-1}/>
        {services.map((_, i) => <HeaderItem index={i} key={i}/>)}
      </nav>
    </header>
  )
}
