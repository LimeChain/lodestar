import {altair} from "@lodestar/types";
import fetch from "cross-fetch";

export interface ICRCClient {
	notifyFinalityUpdate(finalizedUpdate: altair.LightClientFinalityUpdate): Promise<void>

	notifyOptimisticUpdate(optimisticUpdate: altair.LightClientOptimisticUpdate): Promise<void>
}

export class CRCClient implements ICRCClient {

	private readonly baseUrl: string
	private readonly finalityEndpoint: string = "/api/v1/finality_update"
	private readonly optimisticEndpoint: string = "/api/v1/optimistic_update"

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async notifyOptimisticUpdate(optimisticUpdate: altair.LightClientOptimisticUpdate): Promise<void> {
		await this.callCRCNode(this.optimisticEndpoint, optimisticUpdate);
	}

	async notifyFinalityUpdate(finalizedUpdate: altair.LightClientFinalityUpdate): Promise<void> {
		await this.callCRCNode(this.finalityEndpoint, finalizedUpdate);
	}

	private async callCRCNode(endpoint: string, update: altair.LightClientOptimisticUpdate | altair.LightClientFinalityUpdate): Promise<void> {
		await fetch(this.baseUrl + endpoint, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(update)
		});
	}

}