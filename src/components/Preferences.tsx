import React from "react"
import { useRecoilValue } from "recoil";
import { servicesState } from "../state/servicesState";

export default () => {
  const services = useRecoilValue(servicesState)

  return (
    <main>
    </main>
  )
}
