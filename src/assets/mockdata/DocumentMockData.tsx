export const mockUploadDocumentPayload = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://cord.network/2023/cred/v1"
    ],
    "type": [
        "VerifiableCredential"
    ],
    "issuer": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4",
    "issuanceDate": "2025-07-02T10:35:41.585Z",
    "credentialSubject": {
        "studentuniqueid": "NPS7895",
        "firstname": "Sam",
        "middlename": "Ramesh",
        "lastname": "Dona",
        "schoolid": "NPS123",
        "schoolname": "New Poona School",
        "currentclass": 10,
        "previousclass": 9,
        "marksmax": 450,
        "markstotal": 500,
        "percentage": 75,
        "result": "Pass",
        "academicyear": "2025",
        "issuedby": "Mr Patil",
        "issuerauthority": "Principal",
        "issueddate": "Sun, 01 Jun 2025 00:00:00 GMT",
        "validupto": "Mon, 30 Jun 2025 00:00:00 GMT",
        "originalvc": {
            "encoding": "7bit",
            "hash": "b0663cc3fc980033649844b056ab430c2b47eafdaf22d77ff18c87e0c74162ac",
            "mimetype": "image/jpeg",
            "originalname": "10th Marksheet.jfif",
            "size": 9098,
            "url": "https://markstudio-test.s3.ap-south-1.amazonaws.com/apidata/record-content/f7330fb7-a356-4f27-afdf-b1e66283c2d5-10th Marksheet.jfif"
        },
        "id": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4",
        "@context": {
            "vocab": "schema:cord:s33fTLsBqUy8MwWPiy3MPYnj73K1Kdh1kHST5AQCfjUfFadaa#"
        }
    },
    "validFrom": "2025-07-02T10:35:41.585Z",
    "validUntil": "2025-07-03T09:30:00.000Z",
    "metadata": {},
    "credentialSchema": {
        "$id": "schema:cord:s33fTLsBqUy8MwWPiy3MPYnj73K1Kdh1kHST5AQCfjUfFadaa",
        "title": "Marksheet:70fd28a2-c80c-4777-8665-ed0fd43e5268",
        "description": "Schema for Marksheet",
        "properties": {
            "studentuniqueid": {
                "type": "string"
            },
            "firstname": {
                "type": "string"
            },
            "middlename": {
                "type": "string"
            },
            "lastname": {
                "type": "string"
            },
            "schoolid": {
                "type": "string"
            },
            "schoolname": {
                "type": "string"
            },
            "currentclass": {
                "type": "number"
            },
            "previousclass": {
                "type": "number"
            },
            "examdate": {
                "type": "string"
            },
            "cgpa": {
                "type": "number"
            },
            "cgpamax": {
                "type": "number"
            },
            "grade": {
                "type": "string"
            },
            "marksmax": {
                "type": "number"
            },
            "markstotal": {
                "type": "number"
            },
            "percentage": {
                "type": "number"
            },
            "result": {
                "type": "string"
            },
            "academicyear": {
                "type": "string"
            },
            "issuedby": {
                "type": "string"
            },
            "issuerauthority": {
                "type": "string"
            },
            "issueddate": {
                "type": "string"
            },
            "validupto": {
                "type": "string"
            },
            "originalvc": {
                "type": "object"
            },
            "originalvc1": {
                "type": "object"
            },
            "issuingauthorityaddress": {
                "type": "string"
            },
            "issuingauthoritydistrict": {
                "type": "string"
            },
            "issuingauthoritypin": {
                "type": "number"
            },
            "issuingauthoritystate": {
                "type": "string"
            },
            "issuingauthoritycountry": {
                "type": "string"
            }
        },
        "required": [
            "academicyear",
            "currentclass",
            "firstname",
            "issuedby",
            "issueddate",
            "issuerauthority",
            "lastname",
            "originalvc",
            "percentage",
            "previousclass",
            "result",
            "schoolid",
            "schoolname",
            "studentuniqueid",
            "validupto"
        ],
        "type": "object",
        "additionalProperties": false,
        "$schema": "http://cord.network/draft-01/schema#"
    },
    "credentialHash": "0xda25dc4afca94dabc24c074872e2e1b92def4708b29c2e69a65beab9fee09e7b",
    "id": "stmt:cord:s3budEMTE8QUSDAdT621M9d6bn7WDaYJM73c8zgVr2sRBT7aE",
    "proof": [
        {
            "type": "Ed25519Signature2020",
            "created": "Wed Jul 02 2025 10:35:41 GMT+0000 (Coordinated Universal Time)",
            "proofPurpose": "sr25519",
            "verificationMethod": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4#0x4f3a986d94477a22b88cd86b82c5391550ad7c24cfeca27a1e1ef26b87c2c324",
            "proofValue": "z3ZskHqAj4MSTeLjFAp3crBZDiswT2VdHfgdmQMTYoFV8YvVBq3xAyp3y8G83JiLJz1GsY9CN8vCUhygypv91nRLK"
        },
        {
            "type": "CordProof2024",
            "elementUri": "stmt:cord:s3budEMTE8QUSDAdT621M9d6bn7WDaYJM73c8zgVr2sRBT7aE:da25dc4afca94dabc24c074872e2e1b92def4708b29c2e69a65beab9fee09e7b",
            "spaceUri": "space:cord:c36BVtThSzuW4cuS5B2ddxu4Zvn6tFmvoX3hs4APXm3Me4x2m",
            "creatorUri": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4",
            "digest": "0xda25dc4afca94dabc24c074872e2e1b92def4708b29c2e69a65beab9fee09e7b",
            "identifier": "stmt:cord:s3budEMTE8QUSDAdT621M9d6bn7WDaYJM73c8zgVr2sRBT7aE",
            "genesisHash": "0x743115aca5f58453993db0b163772f35d086eafefe3b9bc30e304b76453e428a"
        },
        {
            "type": "CordSDRProof2024",
            "defaultDigest": "0x2df53f7d8d196cbb6e144072b63c110958b0bf1d7f94063dcf88ad657b4cc59d",
            "hashes": [
                "0x025dbbc95592ff5fda1dc9d9ae99302f7b3b8d1d7866b0bbec3b829a58ae0a47",
                "0x08e5f73d275feb9d696116286a8babde983d4c8f9c2d880eaf5bf8535f6e585e",
                "0x0b9735f2564fc7788503b411d5fa6afcc28105dd10356e5937064d145d9928db",
                "0x0c5c08d90b3e8c425e5a77e4e71c92b825c7d61aaba1244dab1a5490febe82e6",
                "0x0c787dfedf22ca3f3c3c7ac17ce43dd2b29a6a134597f1557a95c48c04f35926",
                "0x127f37c89193254de1c6db5b109fbe55cd13a9a659f3b84d4f0ddac4eec60453",
                "0x1e0491d924b02e16fc2dad36a98fb06a59f419d7c6d4ff4c7e8a87ffe0841b54",
                "0x39e29ba457eaff3a123ae40c1fbbc77bd4c1caf55915c1f56eef596a854a09f7",
                "0x47fafd035b8d79970947f1058c545b01f6fed8e8dd9710367ac54f0d0896f6f3",
                "0x4ac1827be823fc638daf95dd49ae923a0f389c709d073d84c245198b1bd90c20",
                "0x58d6051aeab672c3bade922fac061146d45f2958438fd83da7237f0cc9dcec66",
                "0x604828ae57023c09d9ffdd0a48f603007519cad50abfe894b4b5917208ec0440",
                "0x6d1f6db74259fa191ec2bc13dc13020e6e8622849063858768dddf9ff02737e6",
                "0x6e5bbc501090113031d955a266d307a1fff799bdbf96ba2ba2eb00899014c467",
                "0x7bf480602c5670dd94b775c628903d2c98c6e3bb3d2b0e41239011da634fe9b0",
                "0x89e3c9d44727d233575e9a14bc2df8d365655b3dd88a77c60138586a4d53aeb4",
                "0x945cfab7e68685a236de552d147fcbb145c088add8840d0d8ac818699a99c388",
                "0xac1e7d1e2d4b02cd742926dd1c277fed197160c2c5baa6e5acfebc1f3ac89a38",
                "0xac4faaa66b792c74a83af4453cfa1bcf07828b8af00dfbe85d78b0409f6c5840",
                "0xc503d420b3e6f6c033a95cf2c944f7c5db5366abff30e0a2144c4c3fccef8c24",
                "0xf3370586a0e802039970ee8b8de2f41d1935e5239b77f4fde327528d280739da",
                "0xfb48536d7fd5de4dc5caee72ce2c55674a9fd8575b9a1b5fce554becaa3da0d2",
                "0xfbc199adcce50566cd70c3f92a2af6f067bf5cbf235ff101ba7b3f5ca5812709",
                "0xfc167868bf471a740fb448418de1acced968b8e88720bbbbb494a4f6bcf11fc1",
                "0xfd2790bbce7f67ec88a4a7da67cf7092d89b76ca45623364858b743c1e57bab2"
            ],
            "nonceMap": {
                "0x909e3509fded97c0dd7f09356b0e9fc6a26c708f9ae2bebe0359b26a08f7c25d": "eda6cb58-112c-4837-9936-cff9eeb47b91",
                "0x2e93b45b8aaecd770d0d209a53742258193791f5d0929a44276e716a61e96228": "95cb73a9-a434-498d-982e-c42e5046bfb7",
                "0x314493931e89d477e8bfac4891126a822e00492f12d67535163e1bea95e463f3": "5457e0fc-0903-41e6-b034-05da26acbf8d",
                "0x33809c0c716bb6ae699956be561a8e81863be20ca0cd22c33f7284ae6bc5d04a": "d56bb730-0bb3-4685-815c-5fdc06960199",
                "0x29df14bb700ca19ebebc18548dcb8400bb233e8a33cf50a958afba417d6bc8ee": "1e003286-0b1e-4beb-b25e-ab0a1b5129cc",
                "0xf444e21f3d6698c1412183666244ec07b4eced3b775a0268f5937228e032b6e4": "d16f85b2-1960-4283-b15f-2aeed1d01142",
                "0x3e2964edcc037a3436c72e64f0a245316ab089b90a0165710ef6f63b6a79536e": "61f7b762-919b-4497-94ea-2d5ee70c62f4",
                "0xf3c0f3e0faeea60738b25aa21c2fa817ea99c8c4eb96e9bb5975ee597c00f38b": "cd67bdc2-44a0-4557-8260-c460020f0798",
                "0x3d2d5134d35024a721588de9d34805d7400911bd4444f1784d16139e0b6a1e0f": "4c33be1e-84cb-4953-b5d1-b42fedcfb57d",
                "0x8fccec1d0eb1f9cdf883486df7ccbad4174c671ab39e2355bace39efab833663": "c2b08f25-1512-4e65-af91-137d68daf85d",
                "0x383ba67226aeeb7221562df6c2affa161c889b2374463665fbf6a0705779b5a9": "3255514a-b95b-440f-a83b-9c5cd3a1d44b",
                "0x4db2b6fb485fbe4e11d7200d508b98d601c29ced161c2161e772f63ce8b391ae": "6294a738-3bd7-4dcf-8b96-e7ed7f47eb50",
                "0xe6099df6393c6b7f3bd824bb8fd00d3fd64b4ab00d3cc2f8d86febac13b36f9e": "2b250661-36f2-4e9e-8a54-bdf38a0e1043",
                "0x2fc931e6127a88dad7c833b77c9217075b877c1720c931be11cb1e68a04c871a": "c8260ff3-9383-416b-879b-751bc5f4aa03",
                "0xf8a564977f6e109e9a1ff47ae290a0d9bdb9af2af7741dedc89823a4de0bb8c4": "cc44c424-6fc6-466b-9e3c-40aa2effc5a5",
                "0x1dfde73a10c4f5abf282b57d36781e0f24f288e1e711663017039bebcfbea371": "785ecbc3-bd48-401c-9500-f85dd4610ae4",
                "0xa6426a282bfe05c13748e5f93f967abc67b21ee29689a8c51ebc12334202536f": "6dab1668-f90d-46a7-b9ae-294077db5dc0",
                "0x420fef0039b71767d75deb4aea877cd010202153fc13a79fd9c831a3b0c11929": "727734ab-b2d6-42e0-829c-e0bd0480d067",
                "0xad1e54a89ea93bbdd3076645c056fac9810dd5c952157035028d4fc175f5be2a": "cd613efd-4d78-4037-b691-020ba367b5ab",
                "0x93bc8238cf386906051a3a00e95e0788ea74f1913b7ff2489555a2ad3dd5c5a7": "a5cc7fda-3b6b-444a-a757-69272bc2089b",
                "0x8cb5f451f576871d61dc72e1d7462accf78090085f911519c446ef45676bb46f": "f87bd870-f6ba-41b0-b94a-1ab5c1447e3c",
                "0xff0fb5bd828433f39e285cad5b10cad0c9e40ff75affc5dd62b6beb2818de790": "ab712041-3afb-486b-9a35-a74d45a8db24",
                "0x352a54c3dae738f58a253a56c76fcce98e1bd53196ba5866581e7b2aa60af77e": "6c20627e-9df9-4e63-894e-9c2a5ed5ff47",
                "0x583b52c17140b5d92a11c135f952f02bcc3fe52f547de3c2c75a1490b2461a0c": "eaef4291-1b0d-4e0c-b1be-4c22626edcde",
                "0x0b948790e0dd9de82bfb3847edda8e6f3600fdbc9ca33b661944af3cce75eb88": "e7391900-5160-457d-95d8-455d664d7c91"
            },
            "genesisHash": "0x743115aca5f58453993db0b163772f35d086eafefe3b9bc30e304b76453e428a"
        }
    ]
}
export const mockUploadDocumentPayload2 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://cord.network/2023/cred/v1"
  ],
  "type": [
    "VerifiableCredential"
  ],
  "issuer": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4",
  "issuanceDate": "2025-06-30T11:49:53.823Z",
  "credentialSubject": {
    "aadhaar_number": 7891,
    "birthyear": 2005,
    "disability_type": "low vision",
    "gender": "Male",
    "issuedby": "Mr Patil",
    "issueddate": "Sun, 01 Jun 2025 00:00:00 GMT",
    "issuerauthority": "Principal",
    "name": "Sam Dona",
    "originalvc": {
      "encoding": "7bit",
      "hash": "7385cec86bbb8975298b27c7d876912c41ae5f19a3f8a6cbae16e53bfaf2c801",
      "mimetype": "image/jpeg",
      "originalname": "disability-ID-India-1024x597.jpg",
      "size": 66788,
      "url": "https://markstudio-test.s3.ap-south-1.amazonaws.com/apidata/record-content/c194e74d-4870-4ad4-afd1-05b4ef18a63e-disability-ID-India-1024x597.jpg"
    },
    "originalvc1": {
      "encoding": "7bit",
      "hash": "7385cec86bbb8975298b27c7d876912c41ae5f19a3f8a6cbae16e53bfaf2c801",
      "mimetype": "image/jpeg",
      "originalname": "disability-ID-India-1024x597.jpg",
      "size": 66788,
      "url": "https://markstudio-test.s3.ap-south-1.amazonaws.com/apidata/record-content/49eba061-f191-4a72-ad50-62c1ff686c37-disability-ID-India-1024x597.jpg"
    },
    "percentage_of_disability": 62,
    "recordvalidupto": "Mon, 30 Jun 2025 00:00:00 GMT",
    "unique_disability_id_(udid)": "MH14785421115111",
    "validitycertificate": "Permanet",
    "id": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4",
    "@context": {
      "vocab": "schema:cord:s32q3Zb5tpqKAbRctTsTYknq4R541V2wUftzUeF1V7Rs7nmg9#"
    }
  },
  "validFrom": "2025-06-30T11:49:53.823Z",
  "validUntil": "2026-06-30T11:49:53.823Z",
  "metadata": {},
  "credentialSchema": {
    "$id": "schema:cord:s32q3Zb5tpqKAbRctTsTYknq4R541V2wUftzUeF1V7Rs7nmg9",
    "title": "UDID Certificate:23db262b-99f9-4343-9850-b2e82b8a3e6a",
    "description": "UDID Certificate schema",
    "properties": {
      "name": {
        "type": "string"
      },
      "gender": {
        "type": "string"
      },
      "aadhaar_number": {
        "type": "number"
      },
      "unique_disability_id_(udid)": {
        "type": "string"
      },
      "disability_type": {
        "type": "string"
      },
      "birthyear": {
        "type": "number"
      },
      "percentage_of_disability": {
        "type": "number"
      },
      "validitycertificate": {
        "type": "string"
      },
      "issuedby": {
        "type": "string"
      },
      "issuerauthority": {
        "type": "string"
      },
      "issueddate": {
        "type": "string"
      },
      "recordvalidupto": {
        "type": "string"
      },
      "originalvc": {
        "type": "object"
      },
      "originalvc1": {
        "type": "object"
      },
      "studentuniqueid": {
        "type": "string"
      },
      "issuingauthorityaddress": {
        "type": "string"
      },
      "issuingauthoritydistrict": {
        "type": "string"
      },
      "issuingauthoritypin": {
        "type": "string"
      },
      "issuingauthoritystate": {
        "type": "string"
      },
      "issuingauthoritycountry": {
        "type": "string"
      },
      "certificate_validaity_date": {
        "type": "string"
      },
      "issuingauthoritysignature": {
        "type": "object"
      },
      "disabiltycategorysymbol": {
        "type": "object"
      },
      "stateid": {
        "type": "string"
      },
      "photograph": {
        "type": "object"
      },
      "issuedlanguage": {
        "type": "string"
      }
    },
    "required": [
      "aadhaar_number",
      "birthyear",
      "disability_type",
      "gender",
      "issuedby",
      "issueddate",
      "issuerauthority",
      "name",
      "originalvc",
      "originalvc1",
      "percentage_of_disability",
      "recordvalidupto",
      "unique_disability_id_(udid)",
      "validitycertificate"
    ],
    "type": "object",
    "additionalProperties": false,
    "$schema": "http://cord.network/draft-01/schema#"
  },
  "credentialHash": "0x107f566a5db01d87d4b1152cd2966c24742ee6b62f4eb310c61150264be14e87",
  "id": "stmt:cord:s3bwQTnBvwXyWwjHZ8Fh8JcAnxkhFbZByyB9tw2SEw2ZmRXic",
  "proof": [
    {
      "type": "Ed25519Signature2020",
      "created": "Mon Jun 30 2025 11:49:53 GMT+0000 (Coordinated Universal Time)",
      "proofPurpose": "sr25519",
      "verificationMethod": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4#0x4f3a986d94477a22b88cd86b82c5391550ad7c24cfeca27a1e1ef26b87c2c324",
      "proofValue": "z5Cspa9VDbNAv6BJ4C2AByJJaGPo1YqismVjrRqk4rJf5D8PXnXQk7DzYyohFfp4fuZfXzvHQSuQaLo6bPuujTZuD"
    },
    {
      "type": "CordProof2024",
      "elementUri": "stmt:cord:s3bwQTnBvwXyWwjHZ8Fh8JcAnxkhFbZByyB9tw2SEw2ZmRXic:107f566a5db01d87d4b1152cd2966c24742ee6b62f4eb310c61150264be14e87",
      "spaceUri": "space:cord:c36BVtThSzuW4cuS5B2ddxu4Zvn6tFmvoX3hs4APXm3Me4x2m",
      "schemaUri": "schema:cord:s32q3Zb5tpqKAbRctTsTYknq4R541V2wUftzUeF1V7Rs7nmg9",
      "creatorUri": "did:cord:3y6YxHpmG3nysaT4GK7r1zeGAkvKAo15nMfEjAo7D254ZTh4",
      "digest": "0x107f566a5db01d87d4b1152cd2966c24742ee6b62f4eb310c61150264be14e87",
      "identifier": "stmt:cord:s3bwQTnBvwXyWwjHZ8Fh8JcAnxkhFbZByyB9tw2SEw2ZmRXic",
      "genesisHash": "0x743115aca5f58453993db0b163772f35d086eafefe3b9bc30e304b76453e428a"
    },
    {
      "type": "CordSDRProof2024",
      "defaultDigest": "0xdbed606466ab9e349eaeb55b2fe00573c37dea689e7f1c3e18493635f3deaaa2",
      "hashes": [
        "0x0eddb46261f57188e9ea64d0de01744ee8739d6555bcab719d7f9bf446743dc5",
        "0x10256e96ac5828fe4f214b38616cd1b83f17646b0ea7718271d1e00c8e768819",
        "0x16212a56864419d4d5ced1bcc997ef18381f21147dcfa3926331e853995a424d",
        "0x1b6e82c23166500a6066eb73d3fa6f55bceffce4e64a85a60063551660037838",
        "0x2d3ba16b44c337f916038a1314f0f40fe2112f9fb31931d64a5b1372be9e2751",
        "0x30a7d9a85ca119122ef3f060eabd8d2b9150b43579723c27bc9456aae83ce66b",
        "0x33390965cfe5785b5308869f948112b252faa7dbb2be7732cee2b1c7cc2323bd",
        "0x5e96bee1ea19a2b250156f305999ba66576eb8445c99ced2087e41607a550848",
        "0x683c88101a9909934345d38faed35421371f39153dd2148f5de420dc00d577f8",
        "0x68e0018f6b60d015ed18fe5e7a7620315d5bb3272ce78cb70320dc9c22ad42fe",
        "0x693d218b976aba83795427cbd5eb4be8ff85c25aaaf408228b9ff67ecec77892",
        "0x6a032085155d4a03877888ad585731179f03b5402df782af61fddcc208496c14",
        "0x6b850a9a2aa3f80442d9fa7b0de2a6f4d4c008c141fc2570234d625a1855192a",
        "0x737720c23e1168c24b58aff6ee93b3c983a9d9d6ed7ea8105da015e98b22eb6c",
        "0x74e9329f3dfdb9e259e278694119395dd9dced55a72466189ed501c61a7c5dd1",
        "0x8a3226cb69f4796abb12dd28f208d6d956107f4cd190ca3b3581b0e3e9594303",
        "0x94f754c84c25795bacc059856350db665018c5e491c7f21b0bb71c87285f4595",
        "0x9db606b293b6d1dd10b424cc3e06db842e43ff589d9b1fa9dd84d63f46d6b298",
        "0xa739965f9b6693dd916e7c213d70b889068f713dfd25d5b2a99e22d2ddd18ec2",
        "0xb5952ec85bb93f41031c3cbbf331e58692822994942ba9579c1a2133b6b79c8b",
        "0xbc6fd6c6a7a47ab60a072842568b3b7e46dddf8bbb9a56b2d09037e9893aebbe",
        "0xdba55c716114850edc990bf38b634b36d5a8f311a0f65e204c7eb96b4dd43458",
        "0xde8ffc70727c715cc89bb7226a6edb020614615bd929eadc44109b32985e5110",
        "0xe700b6368b587856ac342f002ff85c4334afe18aefcc825473a2cab7f0442585",
        "0xea6f9a88894beb196252ee443f9dcc5fc9646667e705c0d6301b3f493cd8357f",
        "0xf5c42d3d8d85d767db3a013abd9a0e6af3bf816a8ed5c5364ee652fad139b6e6",
        "0xfead0323550b04c48b25f4274b6780649345b69ec2205ac8d642d5454bd65ad2"
      ],
      "nonceMap": {
        "0x6a970828f8c6ec9451199c4b987b2a6c995ac094497585c3750416d64fc32a6a": "3017de75-e745-4d33-8da9-b822e1d59067",
        "0xd0c6606c7f87d607d105447312fd5c4f67513b3b74d8c9fb70e8e07bb59afc93": "fd94734a-a71a-4429-81fa-45e39e727abd",
        "0x06f18dfdc7305d49be04b2dd7c849edb2ea4fefb13b15dddf4aa8c2b614dbb31": "63318a46-c3c0-4b0a-88fb-e3117ad9a7c1",
        "0x03b14ab78ed308b22ade900ddb93b469e0401842b2ed3f5a81616f0ff35e93fd": "84adf112-b3b3-4a79-8277-7daa9aeba798",
        "0x4b0da9b604254323970a466065d8f4ba9be040630ea7a6aabb5b422a18b55018": "af33f36e-93c8-4486-98ab-64f07a9b7148",
        "0xe4b7b3ecc51181ff4dcb1365d95cfe678f6932e3839a8b0ce2eb7d12c5275a75": "f3bccb12-7b3e-481c-8a36-ba1f1cfda9e5",
        "0x9b1b45091c6dc69f8ddbf1bfd151163582b6d83f9e8c3f0bad439b12c798b41d": "a845e2e0-b249-44f5-ba37-a3acd15f2de6",
        "0xfcac75ad42fe0b0176436495d545b659b49037fdde887974e0cf7387501785c5": "11ea8b8b-02e8-4d34-89ad-c43e81d33cab",
        "0xeda6bfc2c17280164e570a459814212c87764c78af7b97dacae1ca0f0fa4e5ef": "fb3a5c6a-4e3d-4d64-916b-acff97ff7da3",
        "0xe5572e63b87ea4cca2d75e13ff6fb7e2b4298de385fac1439f6e7c6f2a6eda71": "a609ba85-394c-49ce-b266-873d04e8d17a",
        "0x528d5ee2129f3c7d69a9927a0d93e037c196fa60e60f56c4ac236e610e9c592b": "a4b0c140-4860-4ab6-93c9-8199e254b009",
        "0xe78526cd974a095b9be32e8917a0b3d98d7fd985fac42afa79eb2c7652e466df": "d6f402ca-9329-4997-993d-2c7f0160f277",
        "0x729ed2ec5cee7485940e6fe0a6b20703b93224ed4d0cf787f6340b95c59e4f97": "85cde2b7-f277-4664-9a42-59dfcd055dd7",
        "0xd3af79c5a759da7136e7472b1a50346f623be1a37a3b1218539c52c216eb6004": "4629c166-deb5-4146-a736-5ba1e04a0957",
        "0x66ca1a19cbc753d51d9a0921a3816a023467673366b52050f6e5a6acd7f5a5c2": "614b55c9-99a9-4ea1-a159-8ae8f146c0b6",
        "0xdb1e3f7c7c0da4f4c583615ee72dfc2e56b7ae40484931d4bb908f763db8d4e1": "274616a0-dd1a-472d-9c11-d2a01c287ce0",
        "0xe97ae405b9ebef04551d3820ce43538e439f9e2846f6ccc2e9fb69310109ac49": "1812e41b-653f-45c0-b96e-5acd323499ad",
        "0xd477e3a2abbad26ecf47bd58d3721275d644ac064a45525882c90b75f05ed8c9": "808e3c21-9437-4306-9d9a-79f136e56816",
        "0xd1a7fecfd95e55e36ba73f4e8364bbca443c30561b4acf373953fdd497df3ed2": "c8ec561f-7abb-4ad1-856c-ffe8bad15c2e",
        "0x372d0a991aa4730d43c04feaf84351691dbdf68aba09c1eff3060091c0e8cc84": "59076a98-5346-4091-87a6-8e02c13dc26c",
        "0x21e0e5b1dcca08751fec8cb732e919cb1b0cd1002e405d2acc2af9c4ee88ca08": "5195f129-f2b2-47b7-a449-b8e835fea6a4",
        "0xbb1f968b78725bd923c66fe49bdc7d4751d018745acd436943dd98421ef8e56a": "f0f0080f-2a96-415a-ac68-104d3bec0ea1",
        "0xb87e5b9a30525a4d22b6210295740eb0a8316d19b86c3773ecaad5a5ed027b21": "7a9809ca-483c-477c-bfd8-6d5178a86609",
        "0xa2352a7ff1602159e40c7dee4d5d1b28f59330f8db367d5a742aea9c8afb2e61": "ced0623c-4972-4588-9e65-4c89756736c8",
        "0x75d95ba714c100f81088229e0d18551c9b74a1a1d4a4c153857fb31ea259a1ae": "8eb9693e-8eb6-4dc4-9db8-22fb17fd722f",
        "0xbcbcb1cc30c0f56bb838a89894716fcd8e5c57b621625c663a17c6ef194da6e8": "2674c0b9-87c3-4410-b099-7cc0dfb0e1bd",
        "0xaef30a06153fe1f0f40102553e69099e54ce5d35610db7adc7bf5d9b8b8fda33": "f9a417eb-4cba-440f-9fef-3b6b425fe12b"
      },
      "genesisHash": "0x743115aca5f58453993db0b163772f35d086eafefe3b9bc30e304b76453e42"
    }
  ]
}
export const mockDocumentsList = [
  {
    name: "Aadhaar Card",
    docType: "IDENTITY_PROOF",
    documentSubType: "AADHAAR"
  },
  {
    name: "PAN Card",
    docType: "IDENTITY_PROOF",
    documentSubType: "PAN"
  }
];
