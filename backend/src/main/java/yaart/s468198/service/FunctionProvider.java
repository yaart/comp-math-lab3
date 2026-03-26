package yaart.s468198.service;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class FunctionProvider {
    private final Map<Integer, Function<Double, Double>> functions = new HashMap<>();
    private final Map<Integer, String> descriptions = new HashMap<>();
    private final Map<Integer, Double> singularPoints = new HashMap<>();

    public FunctionProvider() {

        functions.put(1, x -> 4 * Math.pow(x, 3) - 3 * Math.pow(x, 2) + 5 * x - 20);
        descriptions.put(1, "f(x) = 4x³ - 3x² + 5x - 20");

        functions.put(2, x -> 2 * Math.pow(x, 3) - 5 * Math.pow(x, 2) - 3 * x + 21);
        descriptions.put(2, "f(x) = 2x³ - 5x² - 3x + 21");

        functions.put(3, x -> Math.pow(x, 3) - 3 * Math.pow(x, 2) + 6 * x - 19);
        descriptions.put(3, "f(x) = x³ - 3x² + 6x - 19");

        functions.put(4, x -> {
            if (Math.abs(x) < 1e-12) return Double.POSITIVE_INFINITY;
            return 1.0 / Math.sqrt(Math.abs(x));
        });
        descriptions.put(4, "f(x) = 1/√|x| (разрыв в x=0, сходится)");
        singularPoints.put(4, 0.0);

        functions.put(5, x -> {
            if (Math.abs(x - 2) < 1e-12) return Double.POSITIVE_INFINITY;
            return 1.0 / (x - 2);
        });
        descriptions.put(5, "f(x) = 1/(x-2) (разрыв в x=2, расходится)");
        singularPoints.put(5, 2.0);

        functions.put(6, x -> Math.sin(x));
        descriptions.put(6, "f(x) = sin(x)");
    }

    public Function<Double, Double> getFunction(int id) {
        if (!functions.containsKey(id)) {
            throw new IllegalArgumentException("Функция с ID " + id + " не найдена");
        }
        return functions.get(id);
    }

    public String getDescription(int id) {
        return descriptions.getOrDefault(id, "Неизвестная функция");
    }

    public boolean hasSingularity(int id, double a, double b) {
        if (!singularPoints.containsKey(id)) return false;

        double singularPoint = singularPoints.get(id);

        return singularPoint >= a - 1e-12 && singularPoint <= b + 1e-12;
    }

    public Double getSingularPoint(int id) {
        return singularPoints.get(id);
    }


    public boolean isConvergent(int id, double a, double b) {
        if (!hasSingularity(id, a, b)) return true;

        switch (id) {
            case 4:
                return true;
            case 5:
                return false;
            default:
                return true;
        }
    }

    public String getSingularityType(int id, double a, double b) {
        if (!hasSingularity(id, a, b)) return "Нет особых точек";

        double point = singularPoints.get(id);

        if (Math.abs(point - a) < 1e-10) {
            return String.format("Разрыв на левой границе (x = %.2f)", point);
        } else if (Math.abs(point - b) < 1e-10) {
            return String.format("Разрыв на правой границе (x = %.2f)", point);
        } else if (point > a && point < b) {
            return String.format("Разрыв внутри интервала (x = %.2f)", point);
        }

        return String.format("Особая точка x = %.2f", point);
    }

    public double calculateExactValue(int id, double a, double b) {
        switch (id) {
            case 1:
                return (Math.pow(b, 4) - Math.pow(a, 4)) -
                        (Math.pow(b, 3) - Math.pow(a, 3)) +
                        2.5 * (b * b - a * a) -
                        20 * (b - a);

            case 2:
                return 0.5 * (Math.pow(b, 4) - Math.pow(a, 4)) -
                        (5.0/3.0) * (Math.pow(b, 3) - Math.pow(a, 3)) -
                        1.5 * (b * b - a * a) +
                        21 * (b - a);

            case 3:
                return 0.25 * (Math.pow(b, 4) - Math.pow(a, 4)) -
                        (Math.pow(b, 3) - Math.pow(a, 3)) +
                        3 * (b * b - a * a) -
                        19 * (b - a);

            case 4:
                return calculateExactValueForFunction4(a, b);

            case 5:
                return Double.NaN;

            case 6:
                return Math.cos(a) - Math.cos(b);

            default:
                throw new IllegalArgumentException("Нет аналитического выражения для функции " + id);
        }
    }

    private double calculateExactValueForFunction4(double a, double b) {

        if (a <= 0 && b >= 0) {
            double leftPart = 0;
            double rightPart = 0;

            if (a < 0) {
                leftPart = 2 * Math.sqrt(-a);
            }
            if (b > 0) {
                rightPart = 2 * Math.sqrt(b);
            }

            return leftPart + rightPart;
        } else if (b < 0) {
            return 2 * (Math.sqrt(-a) - Math.sqrt(-b));
        } else {
            return 2 * (Math.sqrt(b) - Math.sqrt(a));
        }
    }
}