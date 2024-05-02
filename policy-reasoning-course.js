let provider
let providerRestriction
let consumer
const showElementById = (elementId) => {
    document.getElementById(elementId)?.classList.add('visible')
}

const hideElementById = (elementId) => {
    document.getElementById(elementId)?.classList.add('hidden')

}

const start = () => {
    hideElementById('start')
    showElementById('card')
}

const chooseGallery = () => {
    provider = 'gallery'
    hideElementById('provider-2')
    hideElementById('provider-3')
    showElementById('gallery-section')
    showElementById('restriction-title')

}

const chooseBob = () => {
    provider = 'bob'
    hideElementById('provider-1')
    hideElementById('provider-3')
    showElementById('bob-section')
    showElementById('restriction-title')
}

const chooseLandlord = () => {
    provider = 'landlord'
    hideElementById('provider-1')
    hideElementById('provider-2')
    showElementById('landlord-section')
    showElementById('restriction-title')
}

const chooseProviderRestriction = (restrictionId) => {
    providerRestriction = restrictionId
    const otherRestrictionId = getOtherRestrictionId(restrictionId)
    hideElementById('restriction-' + otherRestrictionId)
    showElementById('odrl-section')
}

const getOtherRestrictionId = (restrictionId) => {
    switch (provider) {
        case 'gallery':
            return restrictionId === 101 ? 102 : 101
        case 'bob':
            return restrictionId === 201 ? 202 : 201
        case 'landlord':
            return restrictionId === 301 ? 302 : 301
    }
}

const generateODRL = () => {
    showElementById('odrl-json')
    const odrlContent = getODRLContent()
    document.getElementById('odrl-json').innerHTML = JSON.stringify(odrlContent, null, 4)
    showElementById('consumer-title')
    showElementById(provider + '-consumer')
}

const chooseConsumer = (consumerId) => {
    consumer = consumerId
    const otherConsumer = getOtherConsumerId(consumerId)
    hideElementById('consumer-' + otherConsumer)
    showElementById('result-section')
}

const getOtherConsumerId = (consumerId) => {
    switch (provider) {
        case 'gallery':
            return consumerId === 111 ? 112 : 111
        case 'bob':
            return consumerId === 211 ? 212 : 211
        case 'landlord':
            return consumerId === 311 ? 312 : 311
    }
}

const startEngine = () => {
    let isGranted = false
    let result = 'KO'
    switch (providerRestriction) {
        case 101:
            if (consumer === 111) {
                result = 'Congrats Van Gop! You can diplay your art at Gaia-Art'
                isGranted = true
                break;
            }
            result = 'Sorry Alan, you can\'t display your art at Gaia-Art'
            break;
        case 102:
            if (consumer === 111) {
                result = 'Sorry Van Gop, you can\'t display your art at Gaia-Art'
                isGranted = false
                break;
            }
            result = 'Congrats Alan! You can diplay your art at Gaia-Art'
            isGranted = true
            break;
        case 201:
            if (consumer === 211) {
                result = 'Congrats Alice! You can use Bob\'s farming Data'
                isGranted = true
                break;
            }
            result = 'Sorry John, you can\'t use the data for your thesis'
            break;
        case 202:
            if (consumer === 211) {
                result = 'Congrats Alice! You may use Bob\'s farming data given Acme is willing to pay'
                isGranted = true
                break;
            }
            result = 'Congrats John! You may use Bob\'s farming (you just need good funding)'
            isGranted = true
            break;
        case 301:
            if (consumer === 311) {
                result = 'Sorry Ipsum, you can\'t rent the appartement from Amine'
                isGranted = false
                break
            }
            result = 'Congrats Lorem! You may rent the appartement from Amine'
            isGranted = true
            break;
        case 302:
            if (consumer === 311) {
                result = 'Congrats Ipsum! You may setup your (questionable) business in Amine\'s appartement'
                isGranted = true
                break;
            }
            result = 'Congrats Lorem! You may rent the appartement from Amine'
            isGranted = true
            break;
        default:
            result = 'Access not granted'
    }
    showElementById('reasoning-result')
    document.getElementById('reasoning-result').style.backgroundColor = isGranted ? '#b0f8cd' : '#fab8b8'
    document.getElementById('reasoning-result').innerHTML = result
}

const getODRLContent = () => {
    switch (providerRestriction) {
        case 101:
            return {
                "@context": [
                    "http://www.w3.org/ns/odrl.jsonld",
                    { "ovc": "https://w3id.org/gaia-x/ovc/1/" }
                ],
                "@type": "Offer",
                "uid": "http://example.com/policy/123",
                "profile": "https://w3id.org/gaia-x/ovc/1/",
                "prohibition": [
                    {
                        "@type": "Prohibition",
                        "target": "Gaia-Art",
                        "action": "Display",
                        "assigner": "Gaia-Art/Curator",
                        "assignee": {
                            "ovc:constraint": [
                                {
                                    "ovc:leftOperand": "$.credentialSubject.art.source",
                                    "operator": "http://www.w3.org/ns/odrl/2/isAnyOf",
                                    "rightOperand": [
                                        "AI Art", "Image Generator"
                                    ],
                                    "ovc:credentialSubjectType": "art:ArtMetadata"
                                }
                            ]
                        }
                    }
                ]
            }
        case 102:
            return {
                "@context": [
                    "http://www.w3.org/ns/odrl.jsonld",
                    { "ovc": "https://w3id.org/gaia-x/ovc/1/" }
                ],
                "@type": "Offer",
                "uid": "http://example.com/policy/123",
                "profile": "https://w3id.org/gaia-x/ovc/1/",
                "permission": [
                    {
                        "@type": "Permission",
                        "target": "Gaia-Art Gallery",
                        "action": "Display",
                        "assigner": "Gaia-Art Curator",
                        "assignee": {
                            "ovc:constraint": [
                                {
                                    "ovc:leftOperand": "$.credentialSubject.art.type",
                                    "operator": "http://www.w3.org/ns/odrl/2/eq",
                                    "rightOperand": "Pixel Art",
                                    "ovc:credentialSubjectType": "art:ArtMetadata"
                                }
                            ]
                        }
                    }
                ]
            }
        case 201:
            return {
                "@context": [
                    "http://www.w3.org/ns/odrl.jsonld",
                    { "ovc": "https://w3id.org/gaia-x/ovc/1/" }
                ],
                "@type": "Offer",
                "uid": "http://example.com/policy/123",
                "profile": "https://w3id.org/gaia-x/ovc/1/",
                "permission": [
                    {
                        "@type": "Permission",
                        "target": "Bob's Farming Data",
                        "action": "http://www.w3.org/ns/odrl/2/use",
                        "assigner": "Bob",
                        "assignee": {
                            "ovc:constraint": [
                                {
                                    "ovc:leftOperand": "$.credentialSubject.usage.intentions",
                                    "operator": "http://www.w3.org/ns/odrl/2/eq",
                                    "rightOperand": "Marketing Purposes",
                                    "ovc:credentialSubjectType": "Usage Intentions"
                                }
                            ]
                        }
                    }
                ]
            }
        case 202:
            return {
                "@context": [
                    "http://www.w3.org/ns/odrl.jsonld",
                    { "ovc": "https://w3id.org/gaia-x/ovc/1/" }
                ],
                "@type": "Offer",
                "uid": "http://example.com/policy/123",
                "profile": "https://w3id.org/gaia-x/ovc/1/",
                "permission": [
                    {
                        "@type": "Permission",
                        "target": "Bob's Farming Data",
                        "action": "http://www.w3.org/ns/odrl/2/use",
                        "assigner": "Bob",
                        "duty": {
                            "action": [{
                                "rdf:value": { "@id": "odrl:compensate" },
                                "refinement": [{
                                    "leftOperand": "payAmount",
                                    "operator": "eq",
                                    "rightOperand": { "@value": "10000", "@type": "xsd:decimal" },
                                    "unit": "http://dbpedia.org/resource/Euro"
                                }]
                            }]
                        }
                    }]
            }
        case 301:
            return {
                "@context": [
                    "http://www.w3.org/ns/odrl.jsonld",
                    { "ovc": "https://w3id.org/gaia-x/ovc/1/" }
                ],
                "@type": "Offer",
                "uid": "http://example.com/policy/123",
                "profile": "https://w3id.org/gaia-x/ovc/1/",
                "permission": [
                    {
                        "@type": "Permission",
                        "target": "Amine's beautiful appartement",
                        "action": "Rent",
                        "assigner": "Amine"
                    }],
                "prohibition": [
                    {
                        "@type": "Prohibition",
                        "target": "Amine's beautiful appartement",
                        "action": "Setup a business",
                        "assigner": "Amine"
                    }]
            }
        case 302:
            return {
                "@context": [
                    "http://www.w3.org/ns/odrl.jsonld",
                    { "ovc": "https://w3id.org/gaia-x/ovc/1/" }
                ],
                "@type": "Offer",
                "uid": "http://example.com/policy/123",
                "profile": "https://w3id.org/gaia-x/ovc/1/",
                "permission": [
                    {
                        "@type": "Permission",
                        "target": "Amine's beautiful appartement",
                        "action": "Rent",
                        "assigner": "Amine"
                    }],
                "prohibition": [
                    {
                        "@type": "Prohibition",
                        "target": "Amine's beautiful appartement",
                        "action": "Sublet",
                        "assigner": "Amine"
                    }]
            }
        default:
            return 'Something went wrong, reload the page and try again.'
    }
}