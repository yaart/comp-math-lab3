package yaart.s468198.service.methods;

import java.util.function.Function;

public class SimpsonMethod implements IntegrationMethod {
    @Override
    public double calculate(Function<Double, Double> f, double a, double b, int n) {
        if (n % 2 != 0) n++;

        double h = (b - a) / n;
        double sum = f.apply(a) + f.apply(b);

        for (int i = 1; i < n; i++) {
            double x = a + i * h;
            if (i % 2 == 0) {
                sum += 2 * f.apply(x);
            } else {
                sum += 4 * f.apply(x);
            }
        }
        return sum * h / 3.0;
    }

    @Override
    public int getOrder() {
        return 4;
    }
}