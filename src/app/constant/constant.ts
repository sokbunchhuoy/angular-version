export class Constant {
    public static getCategorySeverity(category: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
        switch (category) {
            case 'Accessories':
                return 'success';   // Green
            case 'Clothing':
                return 'info';      // Blue
            case 'Electronics':
                return 'warn';      // Orange
            case 'Fitness':
                return 'secondary'; // Gray
            case 'Home Goods':
                return 'danger';    // Red
            default:
                return 'secondary';
        }
    }
}
