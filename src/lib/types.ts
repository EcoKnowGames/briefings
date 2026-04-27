/** Shape of the scenario JSON exported from the Unity tool */
export interface ScenarioFile {
	AppVersion: string;
	UnityVersion: string;
	Scenario: {
		Name: string;
		Author: string;
		Description: string;
		CoverImageBase64: string;
		Rounds: number;
		ActionsPerRound: number;
		StartCurrency: number;
		Seed: number;
		Entities: ScenarioEntity[];
		Items: ScenarioItem[] | null;
		WinConditions: WinCondition[];
	};
}

export interface WinCondition {
	Title: string;
	Description: string;
	TypeIndex?: number; // 0 = entity, 1 = item, 2 = currency (newer format)
	TargetIndex?: number; // index into Entities/Items array (newer format)
	EntityIndex?: number; // index into Entities array (older format, implies TypeIndex=0)
	LowerLimit: number;
	UpperLimit: number;
	RequiredRounds: number;
}

export interface ScenarioItem {
	ID: string;
	Icon: string;
	Value: number;
	CanSell: boolean;
}

export interface ScenarioEntity {
	ID: string;
	Icon: string; // e.g. "Icons/fish_high_contrast"
	Colour: string; // e.g. "88BCFFFF" (RRGGBBAA hex)
	GrowthRate: number;
	MovementRate: number;
	VulnerableThreshold: number;
	AbundanceThreshold: number;
	AutoPlace: boolean;
	StartPopulation: number;
	CanHarvest: boolean;
	CanIntroduce: boolean;
	HarvestLimit: number;
	IntroduceLimit: number;
	ZoneInformation: { ZoneID: number; GrowthRate: number; MovementRate: number; Transitions: number[] }[];
}

/** Shape of the briefing YAML that researchers write */
export interface BriefingYaml {
	tag?: string;
	author_url?: string;

	situation?: string;
	gameplay_summary?: string;

	play?: {
		url: string;
		label?: string;
	};

	info_card?: {
		title: string;
		body: string;
		image?: string;
	};

	actions_intro?: string;

	entity_descriptions?: Record<string, string>;
	entity_names?: Record<string, string>;
	entity_icons?: Record<string, string>;
	entity_colors?: Record<string, string>;

	zones?: { name: string; color: string }[];

	objectives?: {
		title: string;
		icon?: string;
		entity?: string;
		description: string;
		goal: string;
	}[];

	watch_out?: {
		entity?: string;
		icon?: string;
		name?: string;
		description: string;
	}[];

	why_this_matters?: string;

	further_reading?: {
		title: string;
		description: string;
		url: string;
	}[];

	collaborators?: {
		image: string;
		label?: string;
	};
}

/** Merged data passed to the briefing template */
export interface BriefingData {
	slug: string;
	name: string;
	tag: string;
	appVersion: string;
	author: string;
	authorUrl?: string;
	coverImage: string;
	situation: string;
	rounds: number;
	actions: number;
	credits: number;
	gameplaySummary: string;
	infoCard?: {
		title: string;
		body: string;
		image?: string;
	};
	actionsIntro?: string;
	introduceEntities: EntityDisplay[];
	observeEntities: EntityDisplay[];
	zones: { name: string; color: string }[];
	objectives: ObjectiveDisplay[];
	watchOut: WatchOutDisplay[];
	whyThisMatters?: string;
	furtherReading: { title: string; description: string; url: string }[];
	collaborators?: { image: string; label: string };
	play?: { url: string; label?: string };
}

export interface EntityDisplay {
	id: string;
	name: string;
	iconUrl: string;
	color: string;
	description: string;
	canHarvest: boolean;
	canIntroduce: boolean;
}

export interface ObjectiveDisplay {
	title: string;
	iconUrl: string;
	iconBgColor?: string;
	description: string;
	goal: string;
}

export interface WatchOutDisplay {
	name: string;
	iconUrl: string;
	iconBgColor?: string;
	description: string;
}
