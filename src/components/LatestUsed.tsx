// @ts-ignore: TS2882
import './LatestUsed.css'
import { Component } from 'react'
import { getDataFromFirebase } from '../../api/data.ts'


class LatestUsed extends Component {

	formatData = () => {
		let displayArr: any[] = []
		let dataArr: any[] = []
		let batteryNum
		let batteryName
		let date
		let time
		for (let i = 0; i < 5; i++) {
			batteryNum = "B17"
			batteryName = "Dexter"
			date = "200 B.C.E."
			time = "0 - 7 - 20"
			dataArr = [("#: " + batteryNum), ("Name: " + batteryName), ("Date: " + date), ("Time: " + time)]
			displayArr.push(
				<li>{dataArr.join(" | ")}</li>
			)
		}
		return displayArr
	} 

	render() {
		return (
			<div className="latest-used">
				<h2 className="latest-header">Latest Used</h2>
				<ul>  
					{this.formatData()}
				</ul>
			</div>
		)
	}
}

export default LatestUsed