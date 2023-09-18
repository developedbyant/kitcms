export type TagsData = {
    title:string
    slug:string
    altNames:string[]
}
export type CategoriesData = {
    title:string
    slug:string
    image:import("svelteCMS/types").AssetData
}
export type ProductsData = {
    title:string
    slug:string
    tags:TagsData[]
    categories:CategoriesData[]
    variants:{key:string,value:string}[]
}
export type TestsData = {
    title:string
    slug:string
    overview:string
    age:number
    createdAt:Date
    public:boolean
    altNames:string[]
    variants:{key:string,value:string}[]
    image:import("svelteCMS/types").AssetData
    images:import("svelteCMS/types").AssetData[]
    linkedTags:TagsData[]
    linkedTag:TagsData
    cartItems:{ name:string,price:number }[]
}
export type CartsData = {
    totalPrice:number
    createdAt:Date
    updatedAt:Date
    items:{ name:string,age:number }[]
    products:{ title:string,price:number,active:boolean }[]
}