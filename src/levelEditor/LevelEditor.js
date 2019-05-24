import React from "react";
import { Button } from "antd";
import { redirect } from "../history";

export function LevelEditor(props) {


	return (
		<div>
			<div >
				<Button onClick={() => redirect("/")}>
					Back
				</Button>
			</div>
			Here be level editor
		</div>
	)
}