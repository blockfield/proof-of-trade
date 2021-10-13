export enum UserMenuEnum {
    Traders = 'traders',
    Subscriptions = 'subscriptions',
    Signals = 'signals',
}

export enum TraderMenuEnum {
    Signals = 'signals',
    Proof = 'proof',
    Followers = 'followers',
}

export let menuButtons = {
    'user': [
        UserMenuEnum.Traders,
        UserMenuEnum.Subscriptions,
        UserMenuEnum.Signals,
    ],
    'trader': [
        TraderMenuEnum.Signals,
        TraderMenuEnum.Proof,
        TraderMenuEnum.Followers,
    ],
}

export let menuText = {
    'user': {
        'traders': 'Traders',
        'subscriptions': 'Subscriptions',
        'signals': 'Signals',
    },
    'trader': {
        'signals': 'Signals',
        'proof': 'Proof',
        'followers': 'Followers',
    }
}