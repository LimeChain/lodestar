import {ssz, allForks} from "@lodestar/types";
import fetch from "cross-fetch";

export interface ICRCClient {
	notifyFinalityUpdate(finalizedUpdate: allForks.LightClientFinalityUpdate): Promise<void>

	notifyOptimisticUpdate(optimisticUpdate: allForks.LightClientOptimisticUpdate): Promise<void>
}

export class CRCClient implements ICRCClient {

	private readonly baseUrl: string
	private readonly finalityEndpoint: string = "/api/v1/finality_update"
	private readonly optimisticEndpoint: string = "/api/v1/optimistic_update"

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async notifyOptimisticUpdate(optimisticUpdate: allForks.LightClientOptimisticUpdate): Promise<void> {
		await this.callCRCNode(this.optimisticEndpoint, optimisticUpdate, ssz.altair.LightClientOptimisticUpdate);
	}

	async notifyFinalityUpdate(finalizedUpdate: allForks.LightClientFinalityUpdate): Promise<void> {
		await this.callCRCNode(this.finalityEndpoint, finalizedUpdate, ssz.altair.LightClientFinalityUpdate);
	}

	private async callCRCNode(endpoint: string, update: allForks.LightClientOptimisticUpdate | allForks.LightClientFinalityUpdate, type: any): Promise<void> {
		await fetch(this.baseUrl + endpoint, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(type.toJson(update))
		});
	}

}