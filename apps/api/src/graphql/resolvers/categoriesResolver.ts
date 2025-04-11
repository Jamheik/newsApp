type Category = {
    label: string;
    values: string[];
}

export const Resolver = async (_: any, { label }: { label?: string; }): Promise<Category[]> => {
    const categoryList: Category[] = [
        {
            label: 'Ajankohtaista',
            values: [
                'Ajankohtaista',
                'ajankohtaista',
                'Uutiset',
                'uutiset',
                'Tapahtumat',
                'tapahtumat'
            ]
        },
        {
            label: 'Politiikka & Vaalit',
            values: [
                'Politiikka',
                'politiikka',
                'Vaalit',
                'vaalit',
                'Hallitus',
                'hallitus',
                'Eduskunta',
                'eduskunta',
                'Puolueet',
                'puolueet',
                'Kansanedustajat',
                'kansanedustajat'
            ]
        },
        {
            label: 'Talous & Liiketoiminta',
            values: [
                'Talous',
                'talous',
                'Liiketoiminta',
                'liiketoiminta',
                'Yritykset',
                'yritykset',
                'Markkinat',
                'markkinat'
            ]
        },
        {
            label: 'Tekniikka & Tekoäly',
            values: [
                'Tekniikka',
                'tekniikka',
                'Tekoäly',
                'tekoäly',
                'Teknologia',
                'teknologia',
                'Innovaatiot',
                'innovaatiot'
            ]
        },
        {
            label: 'Terveys & Hyvinvointi',
            values: [
                'Terveys',
                'terveys',
                'Hyvinvointi',
                'hyvinvointi',
                'Meditsiini',
                'meditsiini',
                'Terveysuutiset',
                'terveysuutiset'
            ]
        },
        {
            label: 'Urheilu',
            values: [
                'Urheilu',
                'urheilu',
                'Jalkapallo',
                'jääkiekko',
                'Formula',
                'kiekko',
                'Tulokset',
                'kilpailut'
            ]
        },
        {
            label: 'Kulttuuri & Viihde',
            values: [
                'Kulttuuri',
                'kulttuuri',
                'Viihde',
                'viihde',
                'Elokuvat',
                'elokuvat',
                'Musiikki',
                'musiikki',
                'Taide',
                'taide'
            ]
        },
        {
            label: 'Ympäristö & Luonto',
            values: [
                'Ympäristö',
                'ympäristö',
                'Luonto',
                'luonto',
                'Ilmasto',
                'ilmasto',
                'Kestävyys',
                'kestävyys'
            ]
        },
        {
            label: 'Paikallisuutiset',
            values: [
                'Paikallisuutiset',
                'paikallisuutiset',
                'Kaupungit',
                'kaupungit',
                'Alueuutiset',
                'alueuutiset',
                'Lähiuutiset',
                'lähiuutiset'
            ]
        }
    ];

    return !label ? categoryList : categoryList.filter(category =>
        category.label.toLowerCase().includes(label.toLowerCase())
    )

};