package yaart.s468198.service.methods;

import java.util.function.Function;

public class RectangleMethod implements IntegrationMethod {
    public enum Type { LEFT, RIGHT, MIDDLE }
    private final Type type;

    public RectangleMethod(Type type) {
        this.type = type;
    }

    @Override
    public double calculate(Function<Double, Double> f, double a, double b, int n) {
        double h = (b - a) / n;
        double sum = 0;

        for (int i = 0; i < n; i++) {
            switch (type) {
                case LEFT -> sum += f.apply(a + i * h);
                case RIGHT -> sum += f.apply(a + (i + 1) * h);
                case MIDDLE -> sum += f.apply(a + i * h + h / 2);
            }
        }
        return sum * h;
    }

    @Override
    public int getOrder() {
        return (type == Type.MIDDLE) ? 2 : 1;
    }
}