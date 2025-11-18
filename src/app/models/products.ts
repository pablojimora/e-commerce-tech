import { Schema, model, Model } from "mongoose";

const productsSchema = new Schema({

    sku: {
        type: Number,
        unique: true, 
        required: true 
    },
    name: {
        type: String,
    },
    brand: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    isActive: {
        type: Boolean,
    },
    category: {
        type: String,
    },
    imageUrl:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


});

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Products: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Products = model("products"); // es el nombre de la entidad donde esta apuntando al base de datos
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Products = model("products", productsSchema);
}

export default Products;