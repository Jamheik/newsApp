export type Screen = {
    name: string;
    component: React.ComponentType<any>;
    title?: string | ((route: any) => string);
};

export type AppNavigatorProps = {
    screens: Screen[];
};