package yaart.s468198.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntegrationRequest {
    private int functionId;
    private int methodId;
    private double a;
    private double b;
    private double epsilon;
}