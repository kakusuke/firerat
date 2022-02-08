import React, { useCallback } from "react"
import { useRecoilState, useSetRecoilState } from "recoil";
import { serviceDraftsState, servicesState} from "../state/servicesState";
import ServiceEditRow from "./ServiceEditRow";

export default () => {
  const [drafts, setDrafts] = useRecoilState(serviceDraftsState)
  const setServices = useSetRecoilState(servicesState);

  const addService = useCallback(() => {
    setDrafts(cur => cur.concat([
      {
        sessionId: 'default',
        label:'New',
        url: 'https://localhost'
      }
    ]))
  }, [])

  const save = useCallback(() => {
    setServices(drafts)
  }, [drafts])

  return (
    <main>
      <h1>Services</h1>
      <table>
        <thead>
        <tr>
          <th>Session ID</th>
          <th>Label</th>
          <th>URL</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {drafts.map((_, i) => <ServiceEditRow index={i} key={i}/>)}
        </tbody>
        <tfoot>
        <tr>
          <td colSpan={4}><button type="button" onClick={addService}>+</button></td>
        </tr>
        </tfoot>
      </table>
      <button type="button" onClick={save}>Save</button>
    </main>
  )
}
