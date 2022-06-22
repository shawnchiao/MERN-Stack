import React from 'react';
import UsersList from '../components/UsersLIst';
const users = () => {
    const USERS = [
        {
            id: "u1",
            name: 'Shawn Chiao',
            image: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads02&accessoriesType=Kurt&hairColor=Blonde&facialHairType=BeardLight&facialHairColor=BlondeGolden&clotheType=BlazerSweater&eyeType=Happy&eyebrowType=AngryNatural&mouthType=Eating&skinColor=Tanned',
            places: 3

        }        
    ]

    return <UsersList items={USERS}/>
}

export default users;